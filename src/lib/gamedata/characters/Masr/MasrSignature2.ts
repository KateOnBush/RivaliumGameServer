import Ability from "../../../components/abstract/Ability";
import {NoAbilityData} from "../../../components/sub/AbilityData";
import EAbilityType from "../../../enums/EAbilityType";
import {PlayerEffect} from "../../../components/Player";

export default class MasrSignature2 extends Ability {

    data = NoAbilityData;
    maxCooldown = [8];
    type = EAbilityType.ONETIME;

    onCast(n: number): void {
        let player = this.player;
        player.forceDash(player.mouseDirection, 0.22, 1.8);
        if (this.player.abilities[3].data.active) {
            player.addEffect(PlayerEffect.INVISIBILITY, 3);
        }
    }

}