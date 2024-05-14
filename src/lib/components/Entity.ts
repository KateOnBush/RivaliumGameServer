import ILifetimedElement from "../interfaces/ILifetimedElement";
import Player from "./Player";
import GamePhysicalElement from "./abstract/GamePhysicalElement";
import UResEntityUpdate from "../networking/udp/response/UResEntityUpdate";
import TResEntityDestroy from "../networking/tcp/response/TResEntityDestroy";
import EntityList from "../gamedata/instancelist/EntityList";
import IPlayerElement from "../interfaces/IPlayerElement";
import Projectile from "./Projectile";


export default class Entity extends GamePhysicalElement implements ILifetimedElement, IPlayerElement {

    index: EntityList;

    owner: Player;
    health: number;
    armor: number;
    parameters: number[] = [0, 0, 0, 0, 0];

    lifespan: number;
    lifespanTimeout: NodeJS.Timeout;

    constructor(owner: Player, id: number, x: number, y: number, health: number, armor: number, lifespan: number = 10, entityParameters: number[] = []){

        super();
        this.owner = owner;
        this.id = id;
        this.pos.set(x, y);
        this.health = health;
        this.armor = armor;
        this.parameters = entityParameters;
        this.lifespan = lifespan;

        this.lifespanTimeout = setTimeout(()=>this.destroy(), this.lifespan * 1000);

    }
    

    hit(damage: number, attacker: Player){

        this.health -= damage * (1 - this.armor);
        if (this.health <= 0) {
            this.health = 0;
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

        this.game.broadcast(updateEntity);

    }

    destroy(){

        let entityDestroy = new TResEntityDestroy();
        entityDestroy.entityId = this.id;

        this.game.broadcast(entityDestroy);
        this.game.removeEntity(this.id);

        clearTimeout(this.lifespanTimeout);

    }

    onHit(projectile: Projectile) {};

}