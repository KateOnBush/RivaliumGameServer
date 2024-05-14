import Ability from "../../../components/abstract/Ability";
import {NoAbilityData} from "../../../components/sub/AbilityData";
import EAbilityType from "../../../enums/EAbilityType";
import Lag from "../../../tools/Lag";
import LenyaBlueBullet from "./projectiles/LenyaBlueBullet";
import LenyaRedBullet from "./projectiles/LenyaRedBullet";

export default class LenyaBasicAttack extends Ability {

    data = NoAbilityData;
    maxCooldown = [0.2, 0.2];
    type = EAbilityType.ONETIME;

    onCast(n: number): void {
        let player = this.player;
        let pred = Lag.predictNextPosition(player);
        let proj = n == 0 ? LenyaBlueBullet : LenyaRedBullet;
        player.game.addProjectile(proj, player,
            pred.pos.x, pred.pos.y,
            70, player.mouseDirection,
            1, 1, 5,
            n == 0 ? 5 : 15, 0, n == 0 ? 5 : 0
        );
    }

}