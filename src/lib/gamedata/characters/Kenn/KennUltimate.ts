import Ability from "../../../components/abstract/Ability";
import {ActiveAbilityData} from "../../../components/sub/AbilityData";
import EAbilityType from "../../../enums/EAbilityType";
import {PlayerEffect} from "../../../components/Player";

export default class KennUltimate extends Ability {

    data = new ActiveAbilityData(25);
    maxCooldown = [80];
    type = EAbilityType.ACTIVE;

    override ultimate = true;

    onCast(n: number) {
        this.player.addEffect(PlayerEffect.SPECTRE, 25);
    };

}