import Ability from "../../../components/abstract/Ability";
import {ActiveAbilityData} from "../../../components/sub/AbilityData";
import EAbilityType from "../../../enums/EAbilityType";
import {PlayerEffect} from "../../../components/Player";

export default class KennSignature1 extends Ability {

    data = new ActiveAbilityData(8);
    maxCooldown = [20];
    type = EAbilityType.ACTIVE;

    onCast(n: number): void {

        let player = this.player;
        player.addEffect(PlayerEffect.SWIFTNESS, 8);
        player.applyBoost(1.25, 8);

    }



}