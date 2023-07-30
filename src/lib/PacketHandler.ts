import Lag from "./tools/Lag";
import Logger from "./tools/Logger";
import {dataSize, entityParametersLimit} from "./Macros";
import EBufferType from "./enums/EBufferType";
import {EServerRequest, EServerResponse} from "./enums/EPacketTypes";
import IPlayerSocket from "./interfaces/IPlayerSocket";
import GMBuffer from "./tools/GMBuffer";
import Vector2 from "./tools/vector/Vector2";
import {NumericBoolean, SignedNumericBoolean} from "./types/GameTypes";
import EPlayerState from "./enums/EPlayerState";


export default class PacketHandler {

    static handle(buffer: GMBuffer, socket: IPlayerSocket) {

        buffer.seek(0);
        var type = buffer.read(EBufferType.UInt8);
        if (!socket.player || !socket.game) return;
        let player = socket.player;

        if (![EServerRequest.POSITION_UPDATE, EServerRequest.PING].includes(type)) Logger.info("Received packet type {} from playerId {}", EServerRequest[type], player.id);

        switch (type) {

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

                if (player.state.on_ground){
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

                var _projectile_id = buffer.read(EBufferType.UInt16);
                var _object_id = buffer.read(EBufferType.UInt16);
                var _hit_id = buffer.read(EBufferType.UInt16);

                var proj;

                if (_projectile_id != 0) {
                    proj = socket.game.getProjectile(_projectile_id);
                }

                if (!proj) break;

                let hitplayer = socket.game.getPlayer(_hit_id);
                if (hitplayer) {

                    hitplayer.hit(proj.damage, socket.player);
                    if (proj.bleed > 0)
                        hitplayer.burn(proj.bleed, socket.player);
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