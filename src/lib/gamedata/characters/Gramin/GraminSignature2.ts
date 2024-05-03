import Ability from "../../../components/abstract/Ability";
import {NoAbilityData} from "../../../components/sub/AbilityData";
import EAbilityType from "../../../enums/EAbilityType";

export default class GraminSignature2 extends Ability {

    data = NoAbilityData;
    maxCooldown = [20];
    type = EAbilityType.ONETIME;

    onCast(n: number): void {
        this.player.healInstantly(100);
    }

}