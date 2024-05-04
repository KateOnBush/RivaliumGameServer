import Ability from "../../../components/abstract/Ability";
import {NoAbilityData} from "../../../components/sub/AbilityData";
import EAbilityType from "../../../enums/EAbilityType";
import EntityList from "../../instancelist/EntityList";
import MasrCloud from "./entities/MasrCloud";

export default class MasrSignature1 extends Ability {

    data = NoAbilityData;
    maxCooldown = [20];
    type = EAbilityType.ONETIME;

    onCast(n: number): void {
        let player = this.player;
        setTimeout(() => {
            let m = Math.sign(player.mouse.x - player.x);
            player.game.addEntity(MasrCloud, player,
                player.x + m * ((Math.abs(player.mx) * 4) + 60), player.y, 100, 1, 6, [m]);
        }, 100);
    }

}