import Lag from "./tools/Lag";
import Logger from "./tools/Logger";
import Projectile from "./components/Projectile";
import { dataSize, entityParametersLimit } from "../constants";
import { BType } from "./enums/EBufferValueType";
import { REQUEST, RESPONSE } from "./enums/EPacketTypes";
import IPlayerSocket from "./interfaces/IPlayerSocket";
import GMBuffer from "./tools/GMBuffer";
import Vector2 from "./tools/vector/Vector2";
import { NumericBoolean, SignedNumericBoolean } from "./types/GameTypes";


export default class PacketHandler {

    static handle(buffer: GMBuffer, socket: IPlayerSocket) {

        buffer.seek(0);
        var type = buffer.read(BType.UInt8);
        if (!socket.player || !socket.game) return;
        let player = socket.player;

        switch (type) {

            case REQUEST.POSITION_UPDATE: // Position update

                player.pos.x = buffer.read(BType.SInt32) / 100;
                player.pos.y = buffer.read(BType.SInt32) / 100;
                player.mov.x = buffer.read(BType.SInt32) / 100;
                player.mov.y = buffer.read(BType.SInt32) / 100;

                player.state.on_ground = buffer.read(BType.UInt8) as NumericBoolean;
                player.state.jump_prep = buffer.read(BType.UInt8) / 100;
                player.state.wall_slide = buffer.read(BType.UInt8) as NumericBoolean;
                player.state.grappling = buffer.read(BType.UInt8) as NumericBoolean;
                player.state.grappled = buffer.read(BType.UInt8) as NumericBoolean;
                player.state.dir = buffer.read(BType.UInt8) as SignedNumericBoolean;
                player.state.dash = buffer.read(BType.UInt8) as NumericBoolean;
                player.state.slide = buffer.read(BType.UInt8) as NumericBoolean;
                player.state.grounded = buffer.read(BType.UInt8) as NumericBoolean;
                player.state.slope = buffer.read(BType.UInt8) as NumericBoolean;
                player.mouse.x = buffer.read(BType.SInt32) / 100;
                player.mouse.y = buffer.read(BType.SInt32) / 100;

                let pred = Lag.predictNextPosition(player);
                player.pos.x = pred.pos.x;
                player.mov.x = pred.mov.x;

                if (player.state.on_ground){
                    player.pos.y = pred.pos.y;
                    player.mov.y = pred.mov.y;
                }

                break;

            case REQUEST.GRAPPLING_POSITION: /// Grappling Position Update
            {
                var x = buffer.read(BType.SInt32);
                var y = buffer.read(BType.SInt32);
                let gr = buffer.read(BType.UInt8);

                let b = GMBuffer.allocate(dataSize);

                b.write(RESPONSE.PLAYER_GRAPPLE, BType.UInt8);
                b.write(socket.player.id, BType.UInt16);
                b.write(x, BType.SInt32);
                b.write(y, BType.SInt32);
                b.write(gr, BType.UInt8);
                
                socket.game.broadcastExcept(b, socket.player);
                break;

            }
            case REQUEST.FLIP: /// Flip animation
            {

                let forward = buffer.read(BType.UInt8);
                let start = buffer.read(BType.UInt8);

                let b = GMBuffer.allocate(dataSize);

                b.write(RESPONSE.PLAYER_FLIP, BType.UInt8);
                b.write(socket.player.id, BType.UInt16);
                b.write(forward, BType.SInt8);
                b.write(start, BType.SInt8);

                socket.game.broadcastExcept(b, socket.player);

            }
            case REQUEST.PING: /// Ping

                let e = performance.now();
                socket.player.ping.ms = e - (socket.player.ping.lastSent ?? e);

                let b = GMBuffer.allocate(dataSize);

                b.write(RESPONSE.PING, BType.UInt8);
                b.write(1, BType.UInt8);
                b.write(socket.player.ping.ms, BType.UInt32);

                socket.send(b.getBuffer());
                break;

            case REQUEST.PLAYER_HIT: //Hit (Projectile Destroy)

                var _projectile_id = buffer.read(BType.UInt16);
                var _object_id = buffer.read(BType.UInt16);
                var _hit_id = buffer.read(BType.UInt16);

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

            case REQUEST.ABILITY_CAST: //Casting ability 

                let ability = buffer.read(BType.UInt8);
                let ability_n = buffer.read(BType.UInt8);

                Logger.log("Casting {} of Ability N°{}", ability_n, ability);

                if (socket.player.char.abilities[ability].cast(ability_n, socket.player)) {

                    let buff = GMBuffer.allocate(dataSize);
                    buff.write(RESPONSE.PLAYER_ABILITY_CAST, BType.UInt8);
                    buff.write(socket.player.id, BType.UInt16);
                    buff.write(ability, BType.UInt8);
                    buff.write(ability_n, BType.UInt8);
        
                    socket.game.broadcast(buff);

                }

                break;

            case REQUEST.PROJECTILE_UPDATE: //Projectile Update Position
            {

                let projid = buffer.read(BType.UInt16);
                let projx = buffer.read(BType.SInt32)/100;
                let projy = buffer.read(BType.SInt32)/100;
                let proj_movx = buffer.read(BType.SInt32)/100;
                let proj_movy = buffer.read(BType.SInt32)/100;
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

            case REQUEST.ENTITY_UPDATE: //Entity creation / update
            {

                let ID      = buffer.read(BType.UInt16);
                let x       = buffer.read(BType.SInt16)/100;
                let y       = buffer.read(BType.SInt16)/100;
                let mx      = buffer.read(BType.SInt16)/100;
                let my      = buffer.read(BType.SInt16)/100;
            
                let params = [];
                for(let i = 0; i < entityParametersLimit; i++){
                    params[i] = buffer.read(BType.SInt16)/100;
                }

                let getEntity = socket.game.getEntity(ID);

                if (!getEntity) break;

                getEntity.pos.set(x, y);
                getEntity.mov.set(mx, my);
                getEntity.parameters = params;
                socket.game.declareEntity(getEntity);
                
                break;

            }

            case REQUEST.ENTITY_HIT: //Entity Hit
            {

                let ID      = buffer.read(BType.UInt16);
                let damage  = buffer.read(BType.UInt16);

                let damagedEntity = socket.game.getEntity(ID);

                damagedEntity?.hit(damage, socket.player);
                
                break;

            }

        }

    }

}