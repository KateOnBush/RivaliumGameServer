import Lag from "./tools/Lag";
import Logger from "./tools/Logger";
import {dataSize, entityParametersLimit} from "./Macros";
import EBufferType from "./enums/EBufferType";
import {TCPServerRequest, TCPServerResponse} from "./enums/TCPPacketTypes";
import TCPPlayerSocket from "./networking/TCPPlayerSocket";
import GMBuffer from "./tools/GMBuffer";
import Vector2 from "./tools/vector/Vector2";
import {NumericBoolean, SignedNumericBoolean} from "./types/GameTypes";
import EPlayerState from "./enums/EPlayerState";
import Database from "./database/Database";
import {MatchState} from "./database/match/MatchTypes";
import Time from "./tools/Time";
import {UDPServerResponse} from "./enums/UDPPacketTypes";


export default class PacketHandler {

    static async handle(buffer: GMBuffer, socket: TCPPlayerSocket) {

        buffer.seek(0);
        let type = buffer.read(EBufferType.UInt8);
        let player = socket.player;

        //if (![TCP.POSITION_UPDATE, TCPServerRequest.PING].includes(type)) Logger.info("Received packet type {} from playerId {}", TCPServerRequest[type], player?.id ?? null);

        switch (type) {

            case TCPServerRequest.PING: /// Ping

                let e = performance.now();
                socket.player.ping.ms = e - (socket.player.ping.lastSent ?? e);

                let b = GMBuffer.allocate(dataSize);

                b.write(TCPServerResponse.PING, EBufferType.UInt8);
                b.write(1, EBufferType.UInt8);
                b.write(socket.player.ping.ms, EBufferType.UInt32);

                socket.send(b.getBuffer());
                break;

            case TCPServerRequest.PLAYER_HIT: //Hit (Projectile Destroy)

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

            case TCPServerRequest.ABILITY_CAST: //Casting ability

                let ability = buffer.read(EBufferType.UInt8);
                let ability_n = buffer.read(EBufferType.UInt8);

                if (socket.player.char.abilities[ability].cast(ability_n, socket.player)) {

                    let buff = GMBuffer.allocate(dataSize);
                    buff.write(TCPServerResponse.PLAYER_ABILITY_CAST, EBufferType.UInt8);
                    buff.write(socket.player.id, EBufferType.UInt16);
                    buff.write(ability, EBufferType.UInt8);
                    buff.write(ability_n, EBufferType.UInt8);
        
                    socket.game.broadcast(buff);

                }

                break;

            case TCPServerRequest.PROJECTILE_UPDATE: //Projectile Update Position
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

            case TCPServerRequest.ENTITY_UPDATE: //Entity creation / update
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

            case TCPServerRequest.ENTITY_HIT: //Entity Hit
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