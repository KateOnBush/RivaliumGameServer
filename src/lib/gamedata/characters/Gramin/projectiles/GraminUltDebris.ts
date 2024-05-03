import Projectile from "../../../../components/Projectile";
import ProjectileList from "../../../instancelist/ProjectileList";
import ExplosionList from "../../../instancelist/ExplosionList";

export default class GraminUltDebris extends Projectile {

    override id = ProjectileList.GraminUltDebris;

    override onDestroy() {
        this.owner.game.addExplosion(this.owner,
            ExplosionList.GraminGrenade, this.x, this.y,
            100, 30)
    }

}