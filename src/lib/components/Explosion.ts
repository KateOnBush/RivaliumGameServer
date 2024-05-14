import ILifetimedElement from "../interfaces/ILifetimedElement";
import IPlayerElement from "../interfaces/IPlayerElement";
import Player from "./Player";
import GameElement from "./abstract/GameElement";
import ExplosionList from "../gamedata/instancelist/ExplosionList";
import Vector2 from "../tools/vector/Vector2";
import {Encoding} from "crypto";
import Entity from "./Entity";

export default class Explosion extends GameElement implements ILifetimedElement, IPlayerElement {

    index: ExplosionList;
    radius: number;
    damage: number;

    owner: Player;

    lifespan: number;
    lifespanTimeout: NodeJS.Timeout;

    playersInDamageRadius: Player[] = [];
    playersInShockwaveRadius: Player[] = [];

    entitiesInDamageRadius: Entity[] = [];

    constructor(owner: Player, id: number, x: number, y: number, radius: number, damage: number){
     
        super();
        this.owner = owner;
        this.id = id;
        this.pos.set(x, y);
        this.radius = radius;
        this.damage = damage;

        this.lifespanTimeout = setTimeout(()=>this.destroy(), this.lifespan * 1000);

    }

    trigger() {
        this.entitiesInDamageRadius = this.game.entities.filter(entity => Vector2.subtract(entity.pos, this.pos).magnitude() < this.radius);
        this.entitiesInDamageRadius.forEach(entity => {
            entity.hit(this.damage, this.owner);
        });
        this.playersInDamageRadius = this.game.players.filter(player => Vector2.subtract(player.pos, this.pos).magnitude() < this.radius);
        this.playersInShockwaveRadius = this.game.players.filter(player => Vector2.subtract(player.pos, this.pos).magnitude() < this.radius * 2);
        this.playersInDamageRadius.forEach(player => {
            let percentOfDamage = (Vector2.subtract(player.pos, this.pos).magnitude() / this.radius);
            if (percentOfDamage < 0.5) percentOfDamage = 1;
            else percentOfDamage = 0.25 + 0.75 * (1 - ((percentOfDamage - 0.5) / 0.5));
            if (player.team != this.owner.team) player.hit(Math.round(this.damage * percentOfDamage), this.owner);
        });
        this.onTrigger();
    }

    onTrigger() {}
    
    destroy(): void {
        this.game.removeExplosion(this.id);
        clearTimeout(this.lifespanTimeout);
    }

}