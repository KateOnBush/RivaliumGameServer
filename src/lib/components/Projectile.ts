import Lag from "../tools/Lag";
import ILifetimedElement from "../interfaces/ILifetimedElement";
import IPlayerElement from "../interfaces/IPlayerElement";
import GM from "../tools/GMLib";
import Vector2 from "../tools/vector/Vector2";
import {NumericBoolean} from "../types/GameTypes";
import Player from "./Player";
import GamePhysicalElement from "./abstract/GamePhysicalElement";
import TResProjectileDestroy from "../networking/tcp/response/TResProjectileDestroy";
import UResProjectileUpdate from "../networking/udp/response/UResProjectileUpdate";
import ProjectileList from "../gamedata/instancelist/ProjectileList";

export type ProjectileEventMethod = (proj: Projectile) => void;

export default class Projectile extends GamePhysicalElement implements ILifetimedElement, IPlayerElement {

    owner: Player;
    index: ProjectileList;
    collision: NumericBoolean;
    dieOnCol: NumericBoolean;
    lifespan: number;
    lifespanTimeout: NodeJS.Timeout;
    damage: number;
    bleed: number;
    heal: number;
    bounce: NumericBoolean;
    bounceFriction: number;
    hasWeight: NumericBoolean;

    collided: boolean = false;
    destroyed: boolean = false;
    bounceCount: number = 0;

    constructor(
        owner: Player,
        id: number,
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
        bounceFriction: number,
        hasWeight: NumericBoolean
    ){

        super();
        this.id = id;
        this.owner = owner;
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

    onBounce(){}

    onDestroy(){}
}