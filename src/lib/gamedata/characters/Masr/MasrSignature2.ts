import Ability from "../../../components/abstract/Ability";
import {NoAbilityData} from "../../../components/sub/AbilityData";
import EAbilityType from "../../../enums/EAbilityType";
import {PlayerEffect} from "../../../components/Player";
import MasrBolt from "./projectiles/MasrBolt";
import MasrBoltPowered from "./projectiles/MasrBoltPowered";
import GM from "../../../tools/GMLib";

export default class MasrSignature2 extends Ability {

    data = NoAbilityData;
    maxCooldown = [8];
    type = EAbilityType.ONETIME;

    onCast(n: number): void {
        let player = this.player;
        player.forceDash(player.mouseDirection, 0.22, 1.8);
        if (this.player.abilities[3].data.active) {
            player.addEffect(PlayerEffect.INVISIBILITY, 5);
        }
        let ix = player.x, iy = player.y - 40,
            nx = ix + GM.lengthdir_x(500, player.mouseDirection),
            ny = iy + GM.lengthdir_y(500, player.mouseDirection) - 40;
        setTimeout(() => {
            player.game.addProjectile(MasrBoltPowered, player,
                ix, iy, 80, -90, 1, 1, 10,  40, 0, 0)
        }, 500);
        setTimeout(() => {
            player.game.addProjectile(MasrBoltPowered, player,
                nx, ny, 80, -90, 1, 1, 10,  40, 0, 0)
        }, 600);
    }

}