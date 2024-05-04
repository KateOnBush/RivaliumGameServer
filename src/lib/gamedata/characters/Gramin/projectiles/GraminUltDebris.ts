import Projectile from "../../../../components/Projectile";
import ProjectileList from "../../../instancelist/ProjectileList";
import ExplosionList from "../../../instancelist/ExplosionList";
import GraminGrenadeExplosion from "../explosions/GraminGrenadeExplosion";

export default class GraminUltDebris extends Projectile {

    override index = ProjectileList.GraminUltDebris;

    override onDestroy() {
        this.owner.game.addExplosion(GraminGrenadeExplosion, this.owner,
            this.x, this.y,
            100, 30)
    }

}