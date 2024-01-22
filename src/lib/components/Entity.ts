import {dataSize} from "../Macros";
import EBufferType from "../enums/EBufferType";
import {TCPServerResponse} from "../enums/TCPPacketTypes";
import ILifetimedElement from "../interfaces/ILifetimedElement";
import GMBuffer from "../tools/GMBuffer";
import Player from "./Player";
import GamePhysicalElement from "./abstract/GamePhysicalElement";
import {UDPServerRequest, UDPServerResponse} from "../enums/UDPPacketTypes";
import UResEntityUpdate from "../networking/udp/response/UResEntityUpdate";
import TResEntityDestroy from "../networking/tcp/response/TResEntityDestroy";


export default class Entity extends GamePhysicalElement implements ILifetimedElement {

    owner: Player;
    index: number;
    health: number;
    armor: number;
    parameters: number[] = [0, 0, 0, 0, 0];
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

        let updateEntity = new UResEntityUpdate();
        updateEntity.x = this.x;
        updateEntity.movX = this.mx;
        updateEntity.y = this.y;
        updateEntity.movY = this.my;
        updateEntity.ownerId = this.owner.id;
        updateEntity.entityId = this.id;
        updateEntity.armor = this.armor;
        updateEntity.health = this.health;
        updateEntity.param1 = this.parameters[0];
        updateEntity.param2 = this.parameters[1];
        updateEntity.param3 = this.parameters[2];
        updateEntity.param4 = this.parameters[3];
        updateEntity.param5 = this.parameters[4];

        this.game?.broadcast(updateEntity);

    }

    destroy(){

        if (!this.game) return;

        let entityDestroy = new TResEntityDestroy();
        entityDestroy.entityId = this.id;

        this.game.broadcast(entityDestroy);
        this.game.removeEntity(this.id);

        clearTimeout(this.lifespanTimeout);

    }

}