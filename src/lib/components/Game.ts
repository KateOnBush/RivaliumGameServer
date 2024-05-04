import Player from "./Player";
import Projectile from "./Projectile";
import Entity from "./Entity";
import Explosion from "./Explosion";
import TCPPlayerSocket from "../networking/tcp/TCPPlayerSocket";
import {NumericBoolean} from "../types/GameTypes";
import {defaultBounceFriction} from "../Macros";
import Lag from "../tools/Lag";
import {MatchType} from "../database/match/MatchTypes";
import GameProcessor from "../GameProcessor";
import {FormattedPacket} from "../networking/FormattedPacket";
import EPacketChannel from "../enums/EPacketChannel";
import TResPlayerCreate from "../networking/tcp/response/TResPlayerCreate";
import TResProjectileCreate from "../networking/tcp/response/TResProjectileCreate";
import TResEntityCreate from "../networking/tcp/response/TResEntityCreate";
import TResExplosionCreate from "../networking/tcp/response/TResExplosionCreate";
import Match from "../database/match/Match";
import ElementalOrb, {OrbType} from "../gamedata/general/ElementalOrb";
import TResOrbCreate from "../networking/tcp/response/TResOrbCreate";

export default class Game {

    started = false;

    match: Match;

    type: MatchType;

    players: Player[] = [];
    projectiles: Projectile[] = [];
    entities: Entity[] = [];
    explosions: Explosion[] = [];

    constructor(type: MatchType, match: Match) {
        this.type = type;
        this.match = match;
        GameProcessor.GameList.push(this);
    }

    start() {
        this.announceAllPlayers();
        this.started = true;
    }

    announceAllPlayers() {
        for(const player of this.players) {
            this.announcePlayer(player);
        }
    }

    announcePlayer(player: Player) {

        let playerCreate = new TResPlayerCreate();
        playerCreate.playerId = player.id;
        playerCreate.isYou = 0;
        playerCreate.x = player.x;
        playerCreate.y = player.y;
        playerCreate.teamNumber = player.team;
        playerCreate.characterId = player.character.id;
        playerCreate.characterHealth = player.health;
        playerCreate.characterMaxHealth = player.maxHealth;
        playerCreate.characterUltimateCharge = player.ultimateCharge;
        playerCreate.characterMaxUltimateCharge = player.maxUltimateCharge;

        this.broadcastExcept(playerCreate, player);

        playerCreate.isYou = 1;
        player.send(playerCreate);

    }

    //CALLBACKS
    onKill(victim: Player, killer: Player) {};

    addPlayer(socket: TCPPlayerSocket, charId: number, playerId: number, team: number){

        let nPlayer = new Player(socket, playerId, charId, team);

        nPlayer.game = this;
        nPlayer.pos.x = 512;
        nPlayer.pos.y = 1000;
        socket.player = nPlayer;
        socket.game = this;

        this.players.push(nPlayer);

        return nPlayer;

    }

    addProjectile(
        projectileType: typeof Projectile,
        owner: Player,
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
        bounceFriction: number = defaultBounceFriction,
        hasWeight: NumericBoolean = 1
    ){

        let nProjectile = new projectileType(owner, this.generateProjectileID(), x, y, speed, direction, collision, dieOnCol, lifespan, damage, bleed, heal, bounce, bounceFriction, hasWeight);

        nProjectile.game = this;
        this.projectiles.push(nProjectile);

        this.declareProjectile(nProjectile);
        
        return nProjectile;

    }

    declareProjectile(p: Projectile){

        let projectileDeclaration = new TResProjectileCreate();
        projectileDeclaration.ownerId = p.owner.id;
        projectileDeclaration.projIndex = p.index;
        projectileDeclaration.projId = p.id;
        projectileDeclaration.collision = p.collision;
        projectileDeclaration.dieOnCollision = p.dieOnCol;
        projectileDeclaration.lifespan = p.lifespan;
        projectileDeclaration.damage = p.damage;
        projectileDeclaration.bleed = p.bleed;
        projectileDeclaration.heal = p.heal;
        projectileDeclaration.bounce = p.bounce;
        projectileDeclaration.hasWeight = p.hasWeight;
        projectileDeclaration.oldX = p.pos.x;
        projectileDeclaration.oldY = p.pos.y;
        projectileDeclaration.bounceFriction = p.bounceFriction;

        this.players.forEach(player => {

            let pred = Lag.predictPosition(p.pos, p.mov, Lag.compensateCloseProjectile(player.ping.ms));
            let newSpd = pred.mov.magnitude()
            let newDir = pred.mov.direction();
            projectileDeclaration.x = pred.pos.x;
            projectileDeclaration.y = pred.pos.y;
            projectileDeclaration.speed = newSpd;
            projectileDeclaration.direction = newDir;
            player.send(projectileDeclaration);

        });

    }

    addEntity(entityType: typeof Entity, owner: Player, x: number, y: number, health: number, armor: number, lifespan = 10, entityParameters: number[] = []){

        let nEntity = new entityType(owner, this.generateEntityID(), x, y, health, armor, lifespan, entityParameters);
        nEntity.game = this;
        this.entities.push(nEntity);
        this.declareEntity(nEntity);
        return nEntity;

    }

    addOrb(type: OrbType, x: number, y: number, meantFor: Player, lifespan: number = 15) {
        let nEntity = new ElementalOrb(meantFor, this.generateEntityID(), x, y, 100, 1, lifespan, []);
        nEntity.game = this;
        nEntity.type = type;
        this.entities.push(nEntity);
        let orbCreatePacket = new TResOrbCreate();
        orbCreatePacket.x = x;
        orbCreatePacket.y = y;
        orbCreatePacket.entityId = nEntity.id;
        orbCreatePacket.ownerId = meantFor.id;
        orbCreatePacket.orbType = type;
        orbCreatePacket.lifespan = lifespan;
        this.broadcast(orbCreatePacket);
        return nEntity;
    }

    declareEntity(entity: Entity){

        let declareEntity = new TResEntityCreate();
        declareEntity.entityId = entity.id;
        declareEntity.entityIndex = entity.index;
        declareEntity.ownerId = entity.owner.id;
        declareEntity.x = entity.x;
        declareEntity.y = entity.y;
        declareEntity.mx = entity.mx;
        declareEntity.my = entity.my;
        declareEntity.health = entity.health;
        declareEntity.armor = entity.armor;
        declareEntity.lifespan = entity.lifespan;
        declareEntity.param1 = entity.parameters[0];
        declareEntity.param2 = entity.parameters[1];
        declareEntity.param3 = entity.parameters[2];
        declareEntity.param4 = entity.parameters[3];
        declareEntity.param5 = entity.parameters[4];
        this.broadcast(declareEntity);
    }

    addExplosion(explosionType: typeof Explosion, owner: Player, x: number, y: number, radius: number, damage: number){

        let nExplosion = new explosionType(owner, this.generateExplosionID(), x, y, radius, damage);

        nExplosion.game = this;
        this.explosions.push(nExplosion);

        this.declareExplosion(nExplosion);

        nExplosion.trigger();

    }

    declareExplosion(explosion: Explosion){

        let declareExplosion = new TResExplosionCreate();
        declareExplosion.ownerId = explosion.owner.id;
        declareExplosion.explosionIndex = explosion.index;
        declareExplosion.x = explosion.x;
        declareExplosion.y = explosion.y;
        declareExplosion.radius = explosion.radius;
        declareExplosion.damage = explosion.damage;
        this.broadcast(declareExplosion);

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

    generateProjectileID(){
        let t = Math.random()*10000|0;
        while(this.projectiles.findIndex(n=>n.id == t)>=0){
            t = Math.random()*10000|0;
        }
        return t;
    }

    generateEntityID(){
        let t = Math.random()*10000|0;
        while(this.entities.findIndex(n=>n.id == t)>=0){

            t = Math.random()*10000|0;

        }
        return t;
    }

    generateExplosionID(){
        let t = Math.random()*10000|0;
        while(this.explosions.findIndex(n=>n.id == t)>=0){
            t = Math.random()*10000|0;
        }
        return t;
    }

    broadcast(packet: FormattedPacket){
        let bakedPacket = packet.bake();
        if ((packet.constructor as typeof FormattedPacket).channel == EPacketChannel.TCP) {
            this.players.forEach(p=>p.sendRawTCP(bakedPacket));
            return;
        }
        this.players.forEach(p=>p.sendRawUDP(bakedPacket));
    }

    broadcastExcept(packet: FormattedPacket, except: Player){
        let bakedPacket = packet.bake();
        if ((packet.constructor as typeof FormattedPacket).channel == EPacketChannel.TCP) {
            this.players.forEach(p=> { if (p.id !== except.id) p.sendRawTCP(bakedPacket) });
            return;
        }
        this.players.forEach(p=>{ if (p.id !== except.id) p.sendRawUDP(bakedPacket) });
    }

}