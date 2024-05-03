import Ability from "../../../components/abstract/Ability";
import {ActiveChargesAbilityData} from "../../../components/sub/AbilityData";
import EAbilityType from "../../../enums/EAbilityType";
import Lag from "../../../tools/Lag";
import GM from "../../../tools/GMLib";
import LenyaGrenade from "./projectiles/LenyaGrenade";

export default class LenyaSignature2 extends Ability {

    data= new ActiveChargesAbilityData(5, 1, 0, 0);
    maxCooldown = [18];
    type = EAbilityType.ACTIVECHARGES;

    onCast(n: number): void {
        let player = this.player;
        if (this.data.active){
            if (this.createdProjectile) this.createdProjectile.destroy();
        } else {
            let pred = Lag.predictNextPosition(player);
            let _d = player.mouseDirection + GM.random_range(-2,2);

            let __spd = GM.point_distance(0,0, GM.lengthdir_x(25, _d)+player.mx/3, GM.lengthdir_y(25, _d)+player.my/3);
            let __d = GM.point_direction(0,0, GM.lengthdir_x(25, _d)+player.mx/3, GM.lengthdir_y(25, _d)+player.my/3);
            this.createdProjectile = player.game.addProjectile(LenyaGrenade, player,
                pred.pos.x, pred.pos.y,
                __spd, __d,
                1, 0, 5,
                20, 0, 0, 1
            );
        }
    }

}