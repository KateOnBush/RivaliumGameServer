import { UUID } from "bson";
import Player from "./Player";
import Projectile, { projectileEventCallback } from "./Projectile";
import Entity from "./Entity";
import Explosion from "./Explosion";
import IPlayerSocket from "../interfaces/IPlayerSocket";
import { NumericBoolean } from "../types/GameTypes";
import { dataSize } from "../../constants";
import Lag from "../tools/Lag";
import GMBuffer from "../tools/GMBuffer";
import { randomUUID } from "crypto";
import { RESPONSE } from "../enums/EPacketTypes";
import { BType } from "../enums/EBufferValueType";
import { GameState, GameType } from "../enums/EGameData";

export default class Game {

    id: UUID = new UUID(randomUUID());

    type: GameType = GameType.NORMAL;
    state: GameState = GameState.ONGOING;

    players: Player[] = [];
    projectiles: Projectile[] = [];
    entities: Entity[] = [];
    explosions: Explosion[] = [];
    

    constructor(type?: GameType) {

        if (type) this.type = type;

    }

    addPlayer(socket: IPlayerSocket, charid: number){

        var nPlayer = new Player(socket, this.generateID(), charid);

        nPlayer.game = this;
        socket.player = nPlayer;
        socket.game = this;

        return this.players.push(nPlayer);

    }

    addProjectile(
        owner: Player,
        index: number,
        x: number, y: number,
        speed: number, 
        direction: number, 
        collision: NumericBoolean, 
        dieOnCol: NumericBoolean, 
        lifespan: number, 
        damage: number,
        bleed: number, 
        heal: number, 
        bounce: NumericBoolean = 0, 
        onBounce: projectileEventCallback = () => null, 
        onDestroy: projectileEventCallback = () => null
    ){

        var nProjectile = new Projectile(owner, this.generateProjectileID(), index, x, y, speed, direction, collision, dieOnCol, lifespan, damage, bleed, heal, bounce, onBounce, onDestroy);

        nProjectile.game = this;
        this.projectiles.push(nProjectile);

        this.declareProjectile(nProjectile);
        
        return nProjectile;

    }

    declareProjectile(p: Projectile){

        this.players.forEach(player => {

            var buf = GMBuffer.allocate(dataSize);

            buf.write(RESPONSE.PROJECTILE_CREATE, BType.UInt8);
            buf.write(p.owner.id, BType.UInt16);
            buf.write(p.index, BType.UInt16);
            let pred = Lag.predictPosition(p.pos, p.mov, Lag.compensateCloseProjectile(player.ping.ms));
            buf.write(pred.pos.x*100|0, BType.SInt32);
            buf.write(pred.pos.y*100|0, BType.SInt32);
            let newspd = pred.mov.magnitude()
            let newdir = pred.mov.direction();
            buf.write(newspd*100|0, BType.SInt32);
            buf.write(newdir*10|0, BType.SInt16);
            buf.write(p.collision, BType.UInt8);
            buf.write(p.dieOnCol, BType.UInt8);
            buf.write(p.lifespan, BType.UInt8);
            buf.write(p.damage, BType.UInt16);
            buf.write(p.bleed, BType.UInt16);
            buf.write(p.heal, BType.UInt16);
            buf.write(p.id, BType.UInt16);
            buf.write(p.bounce, BType.UInt8);
            buf.write(p.pos.x*100|0, BType.SInt32);
            buf.write(p.pos.y*100|0, BType.SInt32);

            player.send(buf);

        });

    }

    addEntity(owner: Player, index: number, x: number, y: number, health: number, armor: number, lifespan = 10, entityParameters: number[] = []){

        var nEntity = new Entity(owner, this.generateEntityID(), index, x, y, health, armor, lifespan, entityParameters);

        nEntity.game = this;

        this.entities.push(nEntity);

        this.declareEntity(nEntity);

        return nEntity;

    }

    declareEntity(entity: Entity){

        let buffer = GMBuffer.allocate(dataSize);
        buffer.write(RESPONSE.ENTITY_UPDATE, BType.UInt8);
        buffer.write(entity.index, BType.UInt16);
        buffer.write(entity.owner.id, BType.UInt16);
        buffer.write(entity.id, BType.UInt16);
        buffer.write(entity.x * 100|0, BType.SInt32);
        buffer.write(entity.y * 100|0, BType.SInt32);
        buffer.write(entity.health, BType.UInt32);
        buffer.write(entity.armor * 100 | 0, BType.UInt8);
        for(const par of entity.parameters){
            buffer.write(par * 100 | 0, BType.SInt32);
        }
        this.broadcast(buffer);
    }

    addExplosion(owner: Player, index: number, x: number, y: number, radius: number, damage: number){

        var nExplosion = new Explosion(owner, this.generateExplosionID(), index, x, y, radius, damage);

        nExplosion.game = this;
        this.explosions.push(nExplosion);

        this.declareExplosion(nExplosion);

    }

    declareExplosion(explosion: Explosion){

        let buff = GMBuffer.allocate(dataSize);

        buff.write(RESPONSE.EXPLOSION_CREATE, BType.UInt8);
        buff.write(explosion.owner.id, BType.UInt16);
        buff.write(explosion.index, BType.UInt16);
        buff.write(explosion.x * 100|0, BType.SInt32);
        buff.write(explosion.y * 100|0, BType.SInt32);
        buff.write(explosion.radius, BType.UInt16);
        buff.write(explosion.damage, BType.UInt16);

        this.broadcast(buff);

    }

    getPlayer(_id: number){

        return this.players.find(t=>t.id == _id);

    }

    getProjectile(_id: number){

        return this.projectiles.find(t=>t.id == _id);

    }

    getEntity(_id: number){

        return this.entities.find(t=>t.id == _id);

    }

    getExplosion(_id: number){

        return this.explosions.find(t=>t.id == _id);

    }

    removePlayer(_id: number){

        return this.players.splice(this.players.findIndex(p => p.id === _id), 1);

    }

    removeProjectile(_id: number){

        return this.projectiles.splice(this.projectiles.findIndex(p => p.id === _id), 1);

    }

    removeEntity(_id: number){

        return this.entities.splice(this.entities.findIndex(p=>p.id === _id), 1);

    }

    removeExplosion(_id: number){

        return this.explosions.splice(this.explosions.findIndex(p=>p.id === _id), 1);

    }

    generateID(){

        var t = Math.random()*10000|0;
        while(this.players.findIndex(n=>n.id == t)>=0){

            t = Math.random()*10000|0;

        }

        return t;

    }

    generateProjectileID(){

        var t = Math.random()*10000|0;
        while(this.projectiles.findIndex(n=>n.id == t)>=0){

            t = Math.random()*10000|0;

        }

        return t;

    }

    generateEntityID(){

        var t = Math.random()*10000|0;
        while(this.entities.findIndex(n=>n.id == t)>=0){

            t = Math.random()*10000|0;

        }

        return t;

    }

    generateExplosionID(){

        var t = Math.random()*10000|0;
        while(this.explosions.findIndex(n=>n.id == t)>=0){

            t = Math.random()*10000|0;

        }

        return t;
    }

    broadcast(buffer: GMBuffer){

        this.players.forEach(p=>p.socket.send(buffer.getBuffer()));

    }

    broadcastExcept(buffer: GMBuffer, except: Player){

        this.players.forEach(p=>{if (p.id != except.id) p.socket.send(buffer.getBuffer())});

    }

}

module.exports = Game;