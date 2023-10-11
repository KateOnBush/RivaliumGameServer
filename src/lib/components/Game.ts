import Player from "./Player";
import Projectile, {projectileEventCallback} from "./Projectile";
import Entity from "./Entity";
import Explosion from "./Explosion";
import IPlayerSocket from "../interfaces/IPlayerSocket";
import {NumericBoolean} from "../types/GameTypes";
import {dataSize, defaultBounceFriction} from "../Macros";
import Lag from "../tools/Lag";
import GMBuffer from "../tools/GMBuffer";
import {EServerResponse} from "../enums/TCPPacketTypes";
import EBufferType from "../enums/EBufferType";
import {EGameState} from "../enums/EGameData";
import ProjectileList from "../gamedata/instancelist/ProjectileList";
import {MatchType} from "../database/match/MatchTypes";
import GameProcessor from "../GameProcessor";

enum GameRoundPhase {
    PREPARATION,
    BATTLE
}

export default class Game {

    matchId: string;

    type: MatchType;
    state: EGameState = EGameState.STARTING;

    players: Player[] = [];
    projectiles: Projectile[] = [];
    entities: Entity[] = [];
    explosions: Explosion[] = [];

    currentRound: number = 1;

    constructor(type: MatchType, matchId: string) {
        this.type = type;
        this.matchId = matchId;
        GameProcessor.GameList.push(this);
    }

    changeState(newState: EGameState) {
        this.state = newState;
        let buff = GMBuffer.allocate(dataSize);
        buff.write(EServerResponse.GAME_STATE, EBufferType.UInt8);
        buff.write(newState, EBufferType.UInt8);
        buff.write(this.currentRound, EBufferType.UInt8);
        buff.write(5, EBufferType.UInt8);
        this.broadcast(buff);
        if (newState == EGameState.PREROUND) {
            for(const i of [1, 2, 3, 4]) {
                setTimeout(()=>{
                    let locBuff = GMBuffer.allocate(dataSize);
                    locBuff.write(EServerResponse.GAME_STATE, EBufferType.UInt8);
                    locBuff.write(EGameState.PREROUND, EBufferType.UInt8);
                    locBuff.write(this.currentRound, EBufferType.UInt8);
                    locBuff.write(5 - i, EBufferType.UInt8);
                    this.broadcast(locBuff);
                }, i * 1000);
            }
            setTimeout(()=>{
                this.startRound();
            }, 5000);
        }
    }

    startRound() {
        if (this.currentRound == 15) this.changeState(EGameState.SUDDENDEATH);
        else this.changeState(EGameState.BATTLE);
    }
    setup() {
        this.changeState(EGameState.PREROUND);
    }

    start() {

        this.announceAllPlayers();
        this.setup();

    }

    announceAllPlayers() {
        for(const player of this.players) {
            this.announcePlayer(player);
        }
    }

    announcePlayer(player: Player) {

        let buff = GMBuffer.allocate(dataSize);
        buff.write(EServerResponse.PLAYER_CREATE, 	    EBufferType.UInt8);

        buff.write(player.id, 						    EBufferType.UInt16);
        buff.write(0, 							EBufferType.UInt8); //0: Not you, 1: You
        buff.write(player.char.id, 					    EBufferType.UInt8);
        buff.write(player.char.health, 				    EBufferType.UInt16);
        buff.write(player.char.ultimateCharge, 		    EBufferType.UInt16);
        buff.write(player.char.healthMax, 			    EBufferType.UInt16);
        buff.write(player.char.ultimateChargeMax, 	    EBufferType.UInt16);
        buff.write(Math.round(player.x * 100), 		EBufferType.SInt32);
        buff.write(Math.round(player.y * 100), 		EBufferType.SInt32);

        this.broadcastExcept(buff, player);

        let selfBuff = buff.copy();
        selfBuff.poke(1, EBufferType.UInt8, 3);
        player.send(selfBuff);

    }

    addPlayer(socket: IPlayerSocket, charId: number, playerId: number, team: number){

        let nPlayer = new Player(socket, playerId, charId, team);

        nPlayer.game = this;
        nPlayer.pos.x = 512;
        nPlayer.pos.y = 1170;
        socket.player = nPlayer;
        socket.game = this;

        this.players.push(nPlayer);

        return nPlayer;

    }

    addProjectile(
        owner: Player,
        index: ProjectileList,
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
        onDestroy: projectileEventCallback = () => null,
        bounceFriction: number = defaultBounceFriction,
        hasWeight: NumericBoolean = 1
    ){

        var nProjectile = new Projectile(owner, this.generateProjectileID(), index, x, y, speed, direction, collision, dieOnCol, lifespan, damage, bleed, heal, bounce, onBounce, onDestroy, bounceFriction, hasWeight);

        nProjectile.game = this;
        this.projectiles.push(nProjectile);

        this.declareProjectile(nProjectile);
        
        return nProjectile;

    }

    declareProjectile(p: Projectile){

        this.players.forEach(player => {

            var buf = GMBuffer.allocate(dataSize);

            buf.write(EServerResponse.PROJECTILE_CREATE, EBufferType.UInt8);
            buf.write(p.owner.id, EBufferType.UInt16);
            buf.write(p.index, EBufferType.UInt16);
            let pred = Lag.predictPosition(p.pos, p.mov, Lag.compensateCloseProjectile(player.ping.ms));
            buf.write(pred.pos.x*100|0, EBufferType.SInt32);
            buf.write(pred.pos.y*100|0, EBufferType.SInt32);
            let newspd = pred.mov.magnitude()
            let newdir = pred.mov.direction();
            buf.write(newspd*100|0, EBufferType.SInt32);
            buf.write(newdir*10|0, EBufferType.SInt16);
            buf.write(p.collision, EBufferType.UInt8);
            buf.write(p.dieOnCol, EBufferType.UInt8);
            buf.write(p.lifespan, EBufferType.UInt8);
            buf.write(p.damage, EBufferType.UInt16);
            buf.write(p.bleed, EBufferType.UInt16);
            buf.write(p.heal, EBufferType.UInt16);
            buf.write(p.id, EBufferType.UInt16);
            buf.write(p.bounce, EBufferType.UInt8);
            buf.write(p.pos.x*100|0, EBufferType.SInt32);
            buf.write(p.pos.y*100|0, EBufferType.SInt32);
            buf.write(p.bounceFriction * 100 | 0, EBufferType.UInt8);
            buf.write(p.hasWeight, EBufferType.UInt8);

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
        buffer.write(EServerResponse.ENTITY_CREATE, EBufferType.UInt8);
        buffer.write(entity.index, EBufferType.UInt16);
        buffer.write(entity.owner.id, EBufferType.UInt16);
        buffer.write(entity.id, EBufferType.UInt16);
        buffer.write(entity.x * 100|0, EBufferType.SInt32);
        buffer.write(entity.y * 100|0, EBufferType.SInt32);
        buffer.write(entity.mx * 100|0, EBufferType.SInt32);    
        buffer.write(entity.my * 100|0, EBufferType.SInt32);
        buffer.write(entity.health, EBufferType.UInt32);
        buffer.write(entity.armor * 100 | 0, EBufferType.UInt8);
        buffer.write(entity.lifespan, EBufferType.UInt8);   
        for(const par of entity.parameters){
            buffer.write(par * 100 | 0, EBufferType.SInt32);
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

        buff.write(EServerResponse.EXPLOSION_CREATE, EBufferType.UInt8);
        buff.write(explosion.owner.id, EBufferType.UInt16);
        buff.write(explosion.index, EBufferType.UInt16);
        buff.write(explosion.x * 100|0, EBufferType.SInt32);
        buff.write(explosion.y * 100|0, EBufferType.SInt32);
        buff.write(explosion.radius, EBufferType.UInt16);
        buff.write(explosion.damage, EBufferType.UInt16);

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