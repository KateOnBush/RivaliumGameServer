import Projectile from "../../../../components/Projectile";
import ProjectileList from "../../../instancelist/ProjectileList";
import ExplosionList from "../../../instancelist/ExplosionList";

export default class GraminGrenade extends Projectile {

    override id = ProjectileList.GraminGrenade;

    override onDestroy() {
        this.owner.game.addExplosion(this.owner,
            ExplosionList.GraminGrenade,
            this.x, this.y,
            400, 100
        );
    }

}