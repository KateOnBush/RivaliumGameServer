import Ability from "../../../components/abstract/Ability";
import {NoAbilityData} from "../../../components/sub/AbilityData";
import EAbilityType from "../../../enums/EAbilityType";
import GM from "../../../tools/GMLib";
import EntityList from "../../instancelist/EntityList";

export default class LenyaUltimate extends Ability {

    data = NoAbilityData;
    maxCooldown = [90];
    type = EAbilityType.ONETIME;

    override ultimate = true;

    onCast(n: number): void {
        let player = this.player;
        setTimeout(()=>{

            player.game.addEntity(player,
                EntityList.LenyaUltimateRadius,
                player.x, player.y, 0, 0, 10,
                [3500, 0.01]).step((entity, dt)=>{
                entity.radius = GM.dtlerp(entity.radius ?? 0, entity.parameters[0], entity.parameters[1], dt);
            });

        }, 10/3 * 1000 * .5 | 0)
    }

}