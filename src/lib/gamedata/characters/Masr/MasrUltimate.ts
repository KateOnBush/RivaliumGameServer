import Ability from "../../../components/abstract/Ability";
import {ActiveAbilityData} from "../../../components/sub/AbilityData";
import EAbilityType from "../../../enums/EAbilityType";
import ExplosionList from "../../instancelist/ExplosionList";
import Time from "../../../tools/Time";
import {PlayerEffect} from "../../../components/Player";
import MasrBoltExplosion from "./explosions/MasrBoltExplosion";

export default class MasrUltimate extends Ability {

    data = new ActiveAbilityData(50);
    maxCooldown = [80];
    type = EAbilityType.ACTIVE;

    override ultimate = true;

    async onCast(n: number) {
        let player = this.player;
        await Time.wait((1/0.15) * 0.38 * 1000);
        player.addEffect(PlayerEffect.STORMWRATH, 50);
        player.game.addExplosion(MasrBoltExplosion, player, player.x, player.y, 1000, 150);
    }

}