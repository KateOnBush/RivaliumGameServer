import Lag from "../tools/Lag";
import {dataSize} from "../Macros";
import BType from "../enums/EBufferType";
import {TCPServerResponse} from "../enums/TCPPacketTypes";
import ILifetimedElement from "../interfaces/ILifetimedElement";
import IPlayerElement from "../interfaces/IPlayerElement";
import GMBuffer from "../tools/GMBuffer";
import GM from "../tools/GMLib";
import Vector2 from "../tools/vector/Vector2";
import {NumericBoolean} from "../types/GameTypes";
import Player from "./Player";
import GamePhysicalElement from "./abstract/GamePhysicalElement";
import {UDPServerResponse} from "../enums/UDPPacketTypes";
import TResProjectileDestroy from "../networking/tcp/response/TResProjectileDestroy";
import UResProjectileUpdate from "../networking/udp/response/UResProjectileUpdate";

export type ProjectileEventMethod = (proj: Projectile) => void;

export default class Projectile extends GamePhysicalElement implements ILifetimedElement, IPlayerElement {

    owner: Player;
    index: number;
    collision: NumericBoolean;
    dieOnCol: NumericBoolean;
    lifespan: number;
    lifespanTimeout: NodeJS.Timeout;
    damage: number;
    bleed: number;
    heal: number;
    bounce: NumericBoolean;
    bounceMethod: ProjectileEventMethod;
    destroyMethod: ProjectileEventMethod;
    bounceFriction: number;
    hasWeight: NumericBoolean;

    collided: boolean = false;
    destroyed: boolean = false;
    bounceCount: number = 0;

    constructor(
        owner: Player,
        id: number,
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
        bounce: NumericBoolean, 
        bounceMethod: ProjectileEventMethod,
        destroyMethod: ProjectileEventMethod,
        bounceFriction: number,
        hasWeight: NumericBoolean
    ){

        super();
        this.id = id;
        this.owner = owner;
        this.index = index;
        this.pos = Vector2.cartesian(x, y);
        this.mov = Vector2.cartesian(
            GM.lengthdir_x(speed, direction),
            GM.lengthdir_y(speed, direction)
        )
        this.collision = collision;
        this.dieOnCol = dieOnCol;
        this.lifespan = lifespan;
        this.damage = damage;
        this.bleed = bleed;
        this.heal = heal;
        this.bounce = bounce;
        this.bounceMethod = bounceMethod;
        this.destroyMethod = destroyMethod;
        this.bounceFriction = bounceFriction;
        this.hasWeight = hasWeight;

        this.lifespanTimeout = setTimeout(()=>this.destroy(), this.lifespan * 1000);

    }

    destroy(){

        if (this.game == undefined) return;
        if (this.destroyed) return;
        this.destroyed = true;
        this.onDestroy();

        let projectileDestroy = new TResProjectileDestroy();
        projectileDestroy.projId = this.id;
        this.game.removeProjectile(this.id);
        this.game.broadcast(projectileDestroy);

        clearTimeout(this.lifespanTimeout);

    }

    update(){
        
        if (!this.game) return;
        let projectileUpdate = new UResProjectileUpdate();
        projectileUpdate.projectileId = this.id;

        this.game.players.forEach(pl=>{

            if (pl.id == this.owner.id) return;
            let comp1 = Lag.compensatePrecise(pl.ping.ms);
            let prediction = Lag.predictPosition(this.pos, this.mov, comp1);

            projectileUpdate.x = prediction.pos.x;
            projectileUpdate.y = prediction.pos.y;
            projectileUpdate.movX = prediction.mov.x;
            projectileUpdate.movY = prediction.mov.y;

            pl.send(projectileUpdate);

        })
        
    }

    onBounce(){
        this.bounceMethod(this);
    }

    onDestroy(){
        this.destroyMethod(this);
    }
}