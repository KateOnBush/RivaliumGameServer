import Projectile from "../../../../components/Projectile";
import ProjectileList from "../../../instancelist/ProjectileList";
import ExplosionList from "../../../instancelist/ExplosionList";
import GM from "../../../../tools/GMLib";
import GraminUltDebris from "./GraminUltDebris";
import GraminUltExplosion from "../explosions/GraminUltExplosion";

export default class GraminUltRocket extends Projectile {

    override index = ProjectileList.GraminUltRocket;

    override onDestroy() {
        let player = this.owner;
        player.game.addExplosion(GraminUltExplosion, player,
            this.x, this.y,
            600, 250
        )
        for(const i of [0, 1, 2, 3]){
            player.game.addProjectile(GraminUltDebris, player,
                this.x - GM.lengthdir_x(30, this.direction),
                this.y - GM.lengthdir_y(30, this.direction),
                8, 180 - i * 60,
                1, 0, 1, 0, 0, 0, 1)
        }
    }

}