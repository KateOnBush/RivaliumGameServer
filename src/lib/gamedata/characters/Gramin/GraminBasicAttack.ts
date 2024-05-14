import Ability from "../../../components/abstract/Ability";
import {NoAbilityData} from "../../../components/sub/AbilityData";
import EAbilityType from "../../../enums/EAbilityType";
import Lag from "../../../tools/Lag";
import GM from "../../../tools/GMLib";
import GraminUltBullet from "./projectiles/GraminUltBullet";
import GraminGunBullet from "./projectiles/GraminGunBullet";

export default class GraminBasicAttack extends Ability {

    data = NoAbilityData;
    maxCooldown = [0.1, 2];
    type = EAbilityType.ONETIME;

    shootFunc() {
        let player = this.player;
        let pred = Lag.predictNextPosition(player);
        let ult = player.abilities[3].data.active
        let proj = ult ?
            GraminUltBullet : GraminGunBullet;
        let d = player.mouseDirection,
            _x = GM.lengthdir_x(6, d),
            _y = GM.lengthdir_y(6, d);
        player.game.addProjectile(
            proj,
            player,
            pred.pos.x + _x,
            pred.pos.y + _y - 10,
            80, d + GM.random_range(-5, 5),
            1, 1, 10, ult ? 25 : 15, 0, 0
        )
    }

    onCast(n: number): void {

        this.shootFunc();
        if (n == 1) [.1, .2, .3, .4, .5, .6, .7].forEach(time=>{
            setTimeout(() => this.shootFunc(), time * 1000)
        })

    }



}