import Ability from "../../../components/abstract/Ability";
import {NoAbilityData} from "../../../components/sub/AbilityData";
import EAbilityType from "../../../enums/EAbilityType";
import Lag from "../../../tools/Lag";
import KennDagger from "./projectiles/KennDagger";
import KennDaggerTransformed from "./projectiles/KennDaggerTransformed";

export default class KennBasicAttack extends Ability {

    data = NoAbilityData;
    maxCooldown = [0.2, 1];
    type = EAbilityType.ONETIME;

    onCast(n: number): void {

        let player = this.player;

        const pred = Lag.predictNextPosition(player);
        let inUlt = this.player.abilities[3].data.active;
        let bleeds = this.player.abilities[1].data.active;
        let projectile = inUlt ? KennDaggerTransformed : KennDagger;
        for (let i = 0; i < (n == 1 ? 4 : 1); i++) {
            player.game.addProjectile(
                projectile,
                player,
                pred.pos.x,
                pred.pos.y,
                70,
                player.mouseDirection + (n == 1 ? Math.random() * 40 - 20 : 0),
                1, 1, 10,
                inUlt ? 50 : 25,
                bleeds ? 10 : 0,
                inUlt ? 10 : 0,
            );
        }

    }



}