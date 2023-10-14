import Lag from "./tools/Lag";
import Logger from "./tools/Logger";
import {dataSize, entityParametersLimit} from "./Macros";
import EBufferType from "./enums/EBufferType";
import {EServerRequest, EServerResponse, EPrematchState} from "./enums/TCPPacketTypes";
import IPlayerSocket from "./interfaces/IPlayerSocket";
import GMBuffer from "./tools/GMBuffer";
import Vector2 from "./tools/vector/Vector2";
import {NumericBoolean, SignedNumericBoolean} from "./types/GameTypes";
import EPlayerState from "./enums/EPlayerState";
import Database from "./database/Database";
import {MatchState} from "./database/match/MatchTypes";
import Time from "./tools/Time";


export default class PacketHandler {

    static async handle(buffer: GMBuffer, socket: IPlayerSocket) {

        buffer.seek(0);
        let type = buffer.read(EBufferType.UInt8);
        let player = socket.player;

        if (![EServerRequest.POSITION_UPDATE, EServerRequest.PING].includes(type)) Logger.info("Received packet type {} from playerId {}", EServerRequest[type], player?.id ?? null);

        switch (type) {

            case EServerRequest.IDENTIFY:

                let pass = buffer.read(EBufferType.UInt32);
                let access = buffer.read(EBufferType.UInt32);

                let response = GMBuffer.allocate(dataSize);
                response.write(EServerResponse.PREMATCH, EBufferType.UInt8);

                Logger.info("Player attempting identification, verifying...");

                let match = await Database.verifyPlayer(socket, pass, access);
                if (!match) {
                    response.write(EPrematchState.MATCH_NOT_FOUND, EBufferType.UInt8);
                } else if (match.state == MatchState.FINISHED) {
                    response.write(EPrematchState.MATCH_ENDED, EBufferType.UInt8);
                } else if (match.state == MatchState.STARTED || match.state == MatchState.LOADING) {
                    response.write(EPrematchState.REJOINED, EBufferType.UInt8);
                    socket.identified = true;
                    //rejoining
                } else {

                    Logger.info("Player identified! Match id: {}", match.getID());
                    socket.identified = true;
                    response.write(EPrematchState.IDENTIFIED, EBufferType.UInt8);

                    let msg = GMBuffer.allocate(dataSize);
                    msg.write(EServerResponse.PREMATCH, EBufferType.UInt8);
                    msg.write(EPrematchState.PLAYER_LOADED, EBufferType.UInt8);
                    msg.write(socket.player.matchPlayer.playerId, EBufferType.UInt16);

                    socket.game.broadcast(msg);

                    Logger.info("Sending IDENTIFIED");

                }

                socket.send(response.getBuffer());

                if (!match) break;

                if (match.playerManager.players.every(team => team.every(mPlayer => mPlayer.joined)) && match.state == MatchState.AWAITING_PLAYERS) {

                    //start match
                    match.state = MatchState.LOADING;
                    Logger.info("All players joined, starting...");

                    let msg = GMBuffer.allocate(dataSize);
                    msg.write(EServerResponse.PREMATCH, EBufferType.UInt8);
                    msg.write(EPrematchState.MATCH_STARTING, EBufferType.UInt8);
                    socket.game.broadcast(msg);

                    await Time.wait(10000);

                    msg = GMBuffer.allocate(dataSize);
                    msg.write(EServerResponse.PREMATCH, EBufferType.UInt8);
                    msg.write(EPrematchState.MATCH_STARTED, EBufferType.UInt8);

                    match.state = MatchState.STARTED;

                    await Database.saveMatch(match);

                    socket.game.broadcast(msg);

                    match.game.start();

                }

                break;

            case EServerRequest.POSITION_UPDATE: // Position update

                player.pos.x = buffer.read(EBufferType.SInt32) / 100;
                player.pos.y = buffer.read(EBufferType.SInt32) / 100;
                player.mov.x = buffer.read(EBufferType.SInt32) / 100;
                player.mov.y = buffer.read(EBufferType.SInt32) / 100;

                player.state.id = buffer.read(EBufferType.UInt8) as EPlayerState;

                player.state.on_ground = buffer.read(EBufferType.UInt8) as NumericBoolean;
                player.state.dir = buffer.read(EBufferType.SInt8) as SignedNumericBoolean;
                player.state.slide = buffer.read(EBufferType.UInt8) as NumericBoolean;
                player.mouse.x = buffer.read(EBufferType.SInt32) / 100;
                player.mouse.y = buffer.read(EBufferType.SInt32) / 100;

                let pred = Lag.predictNextPosition(player);
                player.pos.x = pred.pos.x;
                player.mov.x = pred.mov.x;

                if (!player.state.on_ground){
                    player.pos.y = pred.pos.y;
                    player.mov.y = pred.mov.y;
                }

                break;

            case EServerRequest.GRAPPLING_POSITION: /// Grappling Position Update
            {
                var x = buffer.read(EBufferType.SInt32);
                var y = buffer.read(EBufferType.SInt32);
                let gr = buffer.read(EBufferType.UInt8);

                let b = GMBuffer.allocate(dataSize);

                b.write(EServerResponse.PLAYER_GRAPPLE, EBufferType.UInt8);
                b.write(socket.player.id, EBufferType.UInt16);
                b.write(x, EBufferType.SInt32);
                b.write(y, EBufferType.SInt32);
                b.write(gr, EBufferType.UInt8);
                
                socket.game.broadcastExcept(b, socket.player);
                break;

            }

            case EServerRequest.FLIP: /// Flip animation
            {

                let forward = buffer.read(EBufferType.UInt8);
                let start = buffer.read(EBufferType.UInt8);

                let b = GMBuffer.allocate(dataSize);

                b.write(EServerResponse.PLAYER_FLIP, EBufferType.UInt8);
                b.write(socket.player.id, EBufferType.UInt16);
                b.write(forward, EBufferType.SInt8);
                b.write(start, EBufferType.SInt8);

                socket.game.broadcastExcept(b, socket.player);

            }

            case EServerRequest.PING: /// Ping

                let e = performance.now();
                socket.player.ping.ms = e - (socket.player.ping.lastSent ?? e);

                let b = GMBuffer.allocate(dataSize);

                b.write(EServerResponse.PING, EBufferType.UInt8);
                b.write(1, EBufferType.UInt8);
                b.write(socket.player.ping.ms, EBufferType.UInt32);

                socket.send(b.getBuffer());
                break;

            case EServerRequest.PLAYER_HIT: //Hit (Projectile Destroy)

                const _projectile_id = buffer.read(EBufferType.UInt16);
                const _object_id = buffer.read(EBufferType.UInt32);
                const _hit_id = buffer.read(EBufferType.UInt16);
                let _x = buffer.read(EBufferType.SInt32)/100,
                    _y = buffer.read(EBufferType.SInt32)/100;

                let proj;

                if (_projectile_id != 0) {
                    proj = socket.game.getProjectile(_projectile_id);
                }

                if (!proj) break;
                proj.pos.x = _x;
                proj.pos.y = _y;

                let playerHit = socket.game.getPlayer(_hit_id);
                if (playerHit) {

                    playerHit.hit(proj.damage, socket.player);
                    if (proj.bleed > 0)
                        playerHit.burn(proj.bleed, socket.player);
                    if (proj.heal > 0)
                        socket.player.healInstantly(proj.heal);

                }

                proj.destroy();

                break;

            case EServerRequest.ABILITY_CAST: //Casting ability 

                let ability = buffer.read(EBufferType.UInt8);
                let ability_n = buffer.read(EBufferType.UInt8);

                if (socket.player.char.abilities[ability].cast(ability_n, socket.player)) {

                    let buff = GMBuffer.allocate(dataSize);
                    buff.write(EServerResponse.PLAYER_ABILITY_CAST, EBufferType.UInt8);
                    buff.write(socket.player.id, EBufferType.UInt16);
                    buff.write(ability, EBufferType.UInt8);
                    buff.write(ability_n, EBufferType.UInt8);
        
                    socket.game.broadcast(buff);

                }

                break;

            case EServerRequest.PROJECTILE_UPDATE: //Projectile Update Position
            {

                let projid = buffer.read(EBufferType.UInt16);
                let projx = buffer.read(EBufferType.SInt32)/100;
                let projy = buffer.read(EBufferType.SInt32)/100;
                let proj_movx = buffer.read(EBufferType.SInt32)/100;
                let proj_movy = buffer.read(EBufferType.SInt32)/100;
                let proj = socket.game.getProjectile(projid);

                if (!proj) break;
                if (proj.owner.id != socket.player.id) break;

                let comp1 = Lag.compensatePrecise(socket.player.ping.ms);

                let prediction = Lag.predictPosition(Vector2.cartesian(projx, projy), Vector2.cartesian(proj_movx, proj_movy), proj.bounce ? comp1 : 0);

                proj.mov = prediction.mov;
                proj.pos = prediction.pos;

                if (proj.dieOnCol){

                    proj.destroy();
                    break;

                } else if (proj.bounce) {

                    proj.bounceCount++;
                    proj.onBounce();

                } else proj.collided = true;
                
                proj.update();

                break;

            }

            case EServerRequest.ENTITY_UPDATE: //Entity creation / update
            {

                let ID      = buffer.read(EBufferType.UInt16);
                let x       = buffer.read(EBufferType.SInt16)/100;
                let y       = buffer.read(EBufferType.SInt16)/100;
                let mx      = buffer.read(EBufferType.SInt16)/100;
                let my      = buffer.read(EBufferType.SInt16)/100;
            
                let params = [];
                for(let i = 0; i < entityParametersLimit; i++){
                    params[i] = buffer.read(EBufferType.SInt32)/100;
                }

                let getEntity = socket.game.getEntity(ID);

                if (!getEntity) break;

                getEntity.pos.set(x, y);
                getEntity.mov.set(mx, my);
                getEntity.parameters = params;
                getEntity.update();
                
                break;

            }

            case EServerRequest.ENTITY_HIT: //Entity Hit
            {

                let ID      = buffer.read(EBufferType.UInt16);
                let damage  = buffer.read(EBufferType.UInt16);

                let damagedEntity = socket.game.getEntity(ID);

                damagedEntity?.hit(damage, socket.player);
                
                break;

            }

        }

    }

}