import Ability from "../../../components/abstract/Ability";
import {NoAbilityData} from "../../../components/sub/AbilityData";
import EAbilityType from "../../../enums/EAbilityType";
import MasrBolt from "./projectiles/MasrBolt";
import MasrBoltPowered from "./projectiles/MasrBoltPowered";

export default class MasrBasicAttack extends Ability {

    data = NoAbilityData;
    maxCooldown = [0.3, 1.8];
    type = EAbilityType.ONETIME;

    onCast(n: number): void {
        let player = this.player;
        let isUlt = player.abilities[3].data.active;
        if (n == 0) {
            player.game.addProjectile(MasrBolt, player,
                player.x, player.y, 80, player.mouseDirection, 1, 1, 10, isUlt ? 40 : 30, 0, 0, 1, 1, 0)
        } else {
            if (isUlt) {
                setTimeout(() => {
                    player.game.addProjectile(MasrBoltPowered, player,
                        player.x, player.y, 130, player.mouseDirection, 1, 0, 10, 50, 0, 0, 1, 1, 0)

                }, 600)
            } else {
                setTimeout(() => {
                    player.game.addProjectile(MasrBoltPowered, player,
                        player.x, player.y, 110, player.mouseDirection, 1, 1, 10, 40, 0, 0, 0);
                }, 600);

            }
        }
    }

}