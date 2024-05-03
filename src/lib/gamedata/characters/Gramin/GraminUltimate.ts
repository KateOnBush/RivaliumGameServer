import Ability from "../../../components/abstract/Ability";
import {ActiveChargesAbilityData} from "../../../components/sub/AbilityData";
import EAbilityType from "../../../enums/EAbilityType";
import Lag from "../../../tools/Lag";
import GM from "../../../tools/GMLib";
import GraminUltRocket from "./projectiles/GraminUltRocket";

export default class GraminUltimate extends Ability {

    data = new ActiveChargesAbilityData(30, 3, 0, 5);
    maxCooldown = [120];
    type = EAbilityType.ACTIVECHARGES;

    override ultimate = true;

    onCast(n: number): void {
        let player = this.player;
        if (!this.data.active) return;
        let _d = player.mouseDirection + GM.random_range(-2,2);
        let _x = GM.lengthdir_x(20, _d);
        let _y = GM.lengthdir_y(20, _d);
        setTimeout(function(){
            const pred = Lag.predictNextPosition(player);
            player.game.addProjectile(
                GraminUltRocket,
                player,
                pred.pos.x + _x,
                pred.pos.y + _y - 10,
                60, _d,
                1, 1, 10, 30, 0, 0, 0
            )
        }, 110);
    }



}