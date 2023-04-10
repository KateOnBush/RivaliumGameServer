import Lag from "../tools/Lag";
import { dataSize } from "../../constants";
import { BType } from "../enums/EBufferValueType";
import { RESPONSE } from "../enums/EPacketTypes";
import ILifetimedElement from "../interfaces/ILifetimedElement";
import IPlayerElement from "../interfaces/IPlayerElement";
import GMBuffer from "../tools/GMBuffer";
import GM from "../tools/GMLib";
import Vector2 from "../tools/vector/Vector2";
import { NumericBoolean } from "../types/GameTypes";
import Player from "./Player";
import GameElement from "./abstract/GameElement";
import GamePhysicalElement from "./abstract/GamePhysicalElement";

export type projectileEventCallback = (proj: Projectile) => void;

export default class Projectile extends GamePhysicalElement implements ILifetimedElement, IPlayerElement {

    id: number;

    owner: Player;
    index: number;
    pos: Vector2 = new Vector2();
    mov: Vector2 = new Vector2();
    collision: NumericBoolean;
    dieOnCol: NumericBoolean;
    lifespan: number;
    lifespanTimeout: NodeJS.Timeout;
    damage: number;
    bleed: number;
    heal: number;
    bounce: NumericBoolean;
    bounceMethod: projectileEventCallback;
    destroyMethod: projectileEventCallback;

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
        bounceMethod: projectileEventCallback, 
        destroyMethod: projectileEventCallback
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

        this.lifespanTimeout = setTimeout(()=>this.destroy(), this.lifespan);

    }
    

    get direction() {
        return this.mov.direction();
    }

    get speed() {
        return this.mov.magnitude();
    }

    destroy(){

        if (this.game == undefined) return;
        if (this.destroyed) return;

        this.destroyed = true;
        
        this.onDestroy();

        var buff = GMBuffer.allocate(dataSize);
        buff.write(RESPONSE.PROJECTILE_DESTROY, BType.UInt8);
        buff.write(this.id, BType.UInt16);

        this.game.removeProjectile(this.id);

        this.game.broadcast(buff);

        clearTimeout(this.lifespanTimeout);

    }

    update(){
        
        if (!this.game) return;

        this.game.players.forEach(pl=>{

            if (pl.id == this.owner.id) return;

            let comp1 = Lag.compensatePrecise(pl.ping.ms);

            let prediction = Lag.predictPosition(this.pos, this.mov, comp1);

            var boff = Buffer.alloc(dataSize);

            boff.writeUint8(RESPONSE.PROJECTILE_UPDATE, 0);
            boff.writeUInt16LE(this.id, 1);
            boff.writeInt32LE(prediction.pos.x*100|0, 3);
            boff.writeInt32LE(prediction.pos.y*100|0, 7);
            boff.writeInt32LE(prediction.mov.x*100|0, 11);
            boff.writeInt32LE(prediction.mov.y*100|0, 15);

            pl.socket.send(boff);

        })
        
    }

    onBounce(){

        this.bounceMethod(this);

    }

    onDestroy(){

        this.destroyMethod(this);

    }
}