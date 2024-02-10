import Player from "./Player";
import Projectile, {ProjectileEventMethod} from "./Projectile";
import Entity from "./Entity";
import Explosion from "./Explosion";
import TCPPlayerSocket from "../networking/tcp/TCPPlayerSocket";
import {NumericBoolean} from "../types/GameTypes";
import {defaultBounceFriction} from "../Macros";
import Lag from "../tools/Lag";
import {EGameState} from "../enums/EGameData";
import ProjectileList from "../gamedata/instancelist/ProjectileList";
import {MatchType} from "../database/match/MatchTypes";
import GameProcessor from "../GameProcessor";
import {FormattedPacket} from "../networking/FormattedPacket";
import EPacketChannel from "../enums/EPacketChannel";
import TResGameState from "../networking/tcp/response/TResGameState";
import TResPlayerCreate from "../networking/tcp/response/TResPlayerCreate";
import TResProjectileCreate from "../networking/tcp/response/TResProjectileCreate";
import TResEntityCreate from "../networking/tcp/response/TResEntityCreate";
import TResExplosionCreate from "../networking/tcp/response/TResExplosionCreate";

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
        let gameState = new TResGameState();
        gameState.state = newState;
        gameState.currentRound = this.currentRound;
        gameState.timer = 5;
        this.broadcast(gameState);
        if (newState == EGameState.PREROUND) {
            for(const i of [1, 2, 3, 4]) {
                setTimeout(()=>{
                    let gameState = new TResGameState();
                    gameState.state = EGameState.PREROUND;
                    gameState.currentRound = this.currentRound;
                    gameState.timer = 5 - i;
                    this.broadcast(gameState);
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

        let playerCreate = new TResPlayerCreate();
        playerCreate.playerId = player.id;
        playerCreate.isYou = 0;
        playerCreate.x = player.x;
        playerCreate.y = player.y;
        playerCreate.characterId = player.char.id;
        playerCreate.characterHealth = player.char.health;
        playerCreate.characterMaxHealth = player.char.healthMax;
        playerCreate.characterUltimateCharge = player.char.ultimateCharge;
        playerCreate.characterMaxUltimateCharge = player.char.ultimateChargeMax;

        this.broadcastExcept(playerCreate, player);

        playerCreate.isYou = 1;
        player.send(playerCreate);

    }

    addPlayer(socket: TCPPlayerSocket, charId: number, playerId: number, team: number){

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
        onBounce: ProjectileEventMethod = () => null,
        onDestroy: ProjectileEventMethod = () => null,
        bounceFriction: number = defaultBounceFriction,
        hasWeight: NumericBoolean = 1
    ){

        let nProjectile = new Projectile(owner, this.generateProjectileID(), index, x, y, speed, direction, collision, dieOnCol, lifespan, damage, bleed, heal, bounce, onBounce, onDestroy, bounceFriction, hasWeight);

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

    addEntity(owner: Player, index: number, x: number, y: number, health: number, armor: number, lifespan = 10, entityParameters: number[] = []){

        let nEntity = new Entity(owner, this.generateEntityID(), index, x, y, health, armor, lifespan, entityParameters);
        nEntity.game = this;
        this.entities.push(nEntity);
        this.declareEntity(nEntity);
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

    addExplosion(owner: Player, index: number, x: number, y: number, radius: number, damage: number){

        let nExplosion = new Explosion(owner, this.generateExplosionID(), index, x, y, radius, damage);

        nExplosion.game = this;
        this.explosions.push(nExplosion);

        this.declareExplosion(nExplosion);

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
        if (packet.channel == EPacketChannel.TCP) {
            this.players.forEach(p=>p.sendRawTCP(bakedPacket));
            return;
        }
        this.players.forEach(p=>p.sendRawUDP(bakedPacket));
    }

    broadcastExcept(packet: FormattedPacket, except: Player){
        let bakedPacket = packet.bake();
        if (packet.channel == EPacketChannel.TCP) {
            this.players.forEach(p=> { if (p.id !== except.id) p.sendRawTCP(bakedPacket) });
            return;
        }
        this.players.forEach(p=>{ if (p.id !== except.id) p.sendRawUDP(bakedPacket) });
    }

}