import Projectile from "../../../../components/Projectile";
import ProjectileList from "../../../instancelist/ProjectileList";
import ExplosionList from "../../../instancelist/ExplosionList";
import MasrBoltExplosion from "../explosions/MasrBoltExplosion";

export default class MasrBoltPowered extends Projectile {

    override index = ProjectileList.MasrBoltPowered;

    override onDestroy() {
        this.owner.game.addExplosion(MasrBoltExplosion, this.owner, this.x, this.y, 300, 100);
    }

    override onBounce() {
        if (this.bounceCount > 4) this.destroy();
        else this.owner.game.addExplosion(MasrBoltExplosion, this.owner, this.x, this.y, 400, 50);
    }


}