import Ability from "../../../components/abstract/Ability";
import {NoAbilityData} from "../../../components/sub/AbilityData";
import EAbilityType from "../../../enums/EAbilityType";
import Lag from "../../../tools/Lag";
import {PlayerEffect} from "../../../components/Player";
import Time from "../../../tools/Time";
import GM from "../../../tools/GMLib";
import KennDaggerTransformed from "./projectiles/KennDaggerTransformed";
import KennDagger from "./projectiles/KennDagger";

export default class KennSignature2 extends Ability {

    data = NoAbilityData;
    maxCooldown = [30];
    type = EAbilityType.ONETIME;

    async onCast(n: number) {

        let player = this.player;
        player.addEffect(PlayerEffect.PROTECTION, 3);
        await Time.wait(1000);
        const delays = new Array(10);
        let inUlt = player.abilities[3].data.active;
        let bleeds = player.abilities[1].data.active;
        let projectile = inUlt ? KennDaggerTransformed : KennDagger;
        for(const time of delays) {
            const pred = Lag.predictNextPosition(player);
            player.game.addProjectile(
                projectile,
                player,
                pred.pos.x,
                pred.pos.y,
                70,
                player.mouseDirection,
                1, 0, 5,
                inUlt ? 35 : 25,
                bleeds ? 10 : 0,
                inUlt ? 10 : 0,
            );
            player.game.addProjectile(
                projectile,
                player,
                pred.pos.x,
                pred.pos.y,
                70,
                GM.point_direction(0, 0, player.x - player.mouse.x , player.mouse.y - player.y),
                1, 0, 5,
                inUlt ? 35 : 25,
                bleeds ? 10 : 0,
                inUlt ? 10 : 0,
            );
            await Time.wait(0.2 * 1000);
        }

    }

}