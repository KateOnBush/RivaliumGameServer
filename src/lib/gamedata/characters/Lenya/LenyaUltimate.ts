import Ability from "../../../components/abstract/Ability";
import {NoAbilityData} from "../../../components/sub/AbilityData";
import EAbilityType from "../../../enums/EAbilityType";
import GM from "../../../tools/GMLib";
import EntityList from "../../instancelist/EntityList";
import LenyaUltimateRadius from "./entities/LenyaUltimateRadius";

export default class LenyaUltimate extends Ability {

    data = NoAbilityData;
    maxCooldown = [90];
    type = EAbilityType.ONETIME;

    override ultimate = true;

    onCast(n: number): void {
        let player = this.player;
        setTimeout(()=>{

            player.game.addEntity(LenyaUltimateRadius, player,
                player.x, player.y, 0, 0, 10,
                [3500, 0.01]);

        }, 10/3 * 1000 * .5 | 0)
    }

}