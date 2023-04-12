import ILifetimedElement from "../interfaces/ILifetimedElement";
import IPlayerElement from "../interfaces/IPlayerElement";
import Player from "./Player";
import GameElement from "./abstract/GameElement";

export default class Explosion extends GameElement implements ILifetimedElement, IPlayerElement {

    index: number;
    radius: number;
    damage: number;

    owner: Player;

    lifespan: number;
    lifespanTimeout: NodeJS.Timeout;

    constructor(owner: Player, id: number, index: number, x: number, y: number, radius: number, damage: number){
     
        super();
        this.owner = owner;
        this.id = id;
        this.index = index;
        this.pos.set(x, y);
        this.radius = radius;
        this.damage = damage;

        this.lifespanTimeout = setTimeout(()=>this.destroy(), this.lifespan * 1000);

    }
    
    destroy(): void {
        
        //Destroy

        this.game?.removeExplosion(this.id);

        clearTimeout(this.lifespanTimeout);

    }

}

module.exports = Explosion;