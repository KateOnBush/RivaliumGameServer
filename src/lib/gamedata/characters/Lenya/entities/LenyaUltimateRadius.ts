import Projectile from "../../../../components/Projectile";
import Entity from "../../../../components/Entity";
import EntityList from "../../../instancelist/EntityList";
import GM from "../../../../tools/GMLib";
import Vector2 from "../../../../tools/vector/Vector2";
import {PlayerID} from "../../../../database/match/MatchTypes";

export default class LenyaUltimateRadius extends Entity {

    override index = EntityList.LenyaUltimateRadius;

    radius: number = 0;
    playersAffected: PlayerID[] = [];
    lastHealTick: number = 0;

    override step(dt: number) {
        this.radius = GM.dtlerp(this.radius, this.parameters[0], this.parameters[1], dt);
        let playersInRadius = this.game.players.filter(player => Vector2.subtract(this.pos, player.pos).magnitude() < this.radius);
        playersInRadius.forEach(player => {
            if (this.playersAffected.includes(player.id)) return;
            this.playersAffected.push(player.id);
            if(player.team == this.owner.team) player.healInstantly(100, this.owner);
            else player.hit(50, this.owner);
        })
        if (this.lastHealTick <= 0) {
            let playersInRadius = this.game.players.filter(player => Vector2.subtract(this.pos, player.pos).magnitude() < this.radius);
            playersInRadius.forEach(player => {
                if(player.team == this.owner.team) player.heal(10, 1, this.owner);
                else player.burn(5, this.owner, 1);
            })
            this.lastHealTick = 1;
        } else {
            this.lastHealTick -= dt/60;
        }
    }

}