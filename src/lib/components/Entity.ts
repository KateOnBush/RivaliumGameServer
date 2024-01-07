import {dataSize} from "../Macros";
import EBufferType from "../enums/EBufferType";
import {TCPServerResponse} from "../enums/TCPPacketTypes";
import ILifetimedElement from "../interfaces/ILifetimedElement";
import GMBuffer from "../tools/GMBuffer";
import Player from "./Player";
import GamePhysicalElement from "./abstract/GamePhysicalElement";
import {UDPServerRequest, UDPServerResponse} from "../enums/UDPPacketTypes";


export default class Entity extends GamePhysicalElement implements ILifetimedElement {

    owner: Player;
    index: number;
    health: number;
    armor: number;
    parameters: number[];
    lifespan: number;
    lifespanTimeout: NodeJS.Timeout;

    constructor(owner: Player, id: number, index: number, x: number, y: number, health: number, armor: number, lifespan: number = 10, entityParameters: number[] = []){

        super();
        this.owner = owner;
        this.id = id;
        this.pos.set(x, y);
        this.index = index;
        this.health = health;
        this.armor = armor;
        this.parameters = entityParameters;
        this.lifespan = lifespan;

        this.lifespanTimeout = setTimeout(()=>this.destroy(), this.lifespan * 1000);

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

        let buffer = GMBuffer.allocate(dataSize);
        buffer.write(UDPServerResponse.ENTITY_UPDATE, EBufferType.UInt8);
        buffer.write(this.owner.id, EBufferType.UInt16);
        buffer.write(this.id, EBufferType.UInt16);
        buffer.write(this.x * 100|0, EBufferType.SInt32);
        buffer.write(this.y * 100|0, EBufferType.SInt32);
        buffer.write(this.mx * 100|0, EBufferType.SInt32);
        buffer.write(this.my * 100|0, EBufferType.SInt32);
        buffer.write(this.health, EBufferType.UInt32);
        buffer.write(this.armor * 100 | 0, EBufferType.UInt8);
        for(const par of this.parameters){
            buffer.write(par * 100 | 0, EBufferType.SInt32);
        }
        this.game?.broadcast(buffer);

    }

    destroy(){

        if (!this.game) return;

        var buffer = GMBuffer.allocate(dataSize);
        buffer.write(TCPServerResponse.ENTITY_DESTROY, EBufferType.UInt8);
        buffer.write(this.id, EBufferType.UInt16);

        this.game.broadcast(buffer);

        this.game.removeEntity(this.id);

        clearTimeout(this.lifespanTimeout);

    }

}