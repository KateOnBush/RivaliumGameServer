import Projectile from "../../../../components/Projectile";
import ProjectileList from "../../../instancelist/ProjectileList";
import ExplosionList from "../../../instancelist/ExplosionList";

export default class MasrBoltPowered extends Projectile {

    override id = ProjectileList.MasrBoltPowered;

    override onDestroy() {
        this.owner.game.addExplosion(this.owner, ExplosionList.MasrBolt, this.x, this.y, 300, 100);
    }

    override onBounce() {
        if (this.bounceCount > 4) this.destroy();
        else this.owner.game.addExplosion(this.owner, ExplosionList.MasrBolt, this.x, this.y, 400, 80);
    }


}