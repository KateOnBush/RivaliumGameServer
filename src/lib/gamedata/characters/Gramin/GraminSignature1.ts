import Ability from "../../../components/abstract/Ability";
import {NoAbilityData} from "../../../components/sub/AbilityData";
import EAbilityType from "../../../enums/EAbilityType";
import Lag from "../../../tools/Lag";
import GM from "../../../tools/GMLib";
import GraminGrenade from "./projectiles/GraminGrenade";

export default class GraminSignature1 extends Ability {

    data = NoAbilityData;
    maxCooldown = [10];
    type = EAbilityType.ONETIME;

    onCast(n: number): void {

        let player = this.player;
        let pred = Lag.predictNextPosition(player);
        let _d = player.mouseDirection+GM.random_range(-2,2);

        let __spd = GM.point_distance(0,0, GM.lengthdir_x(25, _d)+player.mov.x/3, GM.lengthdir_y(25, _d)+player.mov.y/3);
        let __d = GM.point_direction(0,0, GM.lengthdir_x(25, _d)+player.mov.x/3, GM.lengthdir_y(25, _d)+player.mov.y/3);
        player.game?.addProjectile(
            GraminGrenade,
            player,
            pred.pos.x,
            pred.pos.y - 10,
            __spd, __d,
            1, 0, 1, 50, 10, 0, 1
        )

    }



}