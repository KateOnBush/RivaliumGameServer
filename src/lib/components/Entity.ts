import { dataSize } from "../../constants";
import { BType } from "../enums/EBufferValueType";
import { RESPONSE } from "../enums/EPacketTypes";
import ILifetimedElement from "../interfaces/ILifetimedElement";
import GMBuffer from "../tools/GMBuffer";
import Player from "./Player";
import GamePhysicalElement from "./abstract/GamePhysicalElement";

export default class Entity extends GamePhysicalElement implements ILifetimedElement {

    owner: Player;
    index: number;
    health: number;
    armor: number;
    lifetime: number;
    parameters: number[];
    lifespan: number;
    lifespanTimeout: NodeJS.Timeout;

    constructor(owner: Player, id: number, index: number, x: number, y: number, health: number, armor: number, lifetime: number = 10, entityParameters: number[] = []){

        super();
        this.owner = owner;
        this.id = id;
        this.pos.set(x, y);
        this.index = index;
        this.health = health;
        this.armor = armor;
        this.parameters = entityParameters;
        this.lifetime = lifetime;

        this.lifespanTimeout = setTimeout(()=>this.destroy(), this.lifespan);

    }
    

    hit(damage: number, attacker: Player){

        this.health -= damage * (1 - this.armor);
        if (this.health <= 0) {
            this.destroy();
        } else {
            this.update();
        }

    }

    update(){

    }

    destroy(){

        if (!this.game) return;

        var buffer = GMBuffer.allocate(dataSize);
        buffer.write(RESPONSE.ENTITY_DESTROY, BType.UInt8);
        buffer.write(this.id, BType.UInt16);

        this.game.broadcast(buffer);

        this.game.removeEntity(this.id);

        clearTimeout(this.lifespanTimeout);

    }

}