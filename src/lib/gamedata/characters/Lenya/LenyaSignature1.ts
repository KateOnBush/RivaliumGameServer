import Ability from "../../../components/abstract/Ability";
import {NoAbilityData} from "../../../components/sub/AbilityData";
import EAbilityType from "../../../enums/EAbilityType";
import LenyaWall from "./entities/LenyaWall";

export default class LenyaSignature1 extends Ability {

    data = NoAbilityData;
    maxCooldown = [40];
    type = EAbilityType.ONETIME;

    onCast(n: number): void {
        let player = this.player;
        if (!player.game) return;
        let x = player.x, y = player.y, movvec = player.mov, mousex = player.mouse.x;
        let createdX = x + (Math.sign(mousex - x) == Math.sign(movvec.x) ? 16*movvec.x : Math.sign(mousex - x)*60),
            createdY = y + 100;
        let d = player.mouseDirection;
        player.game.addEntity(LenyaWall,
            player,
            createdX, createdY,
            100, .1,
            10,
            [d, d, d, d]
        )
    }

}