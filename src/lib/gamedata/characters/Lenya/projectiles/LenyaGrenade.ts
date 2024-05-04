import Projectile from "../../../../components/Projectile";
import ProjectileList from "../../../instancelist/ProjectileList";
import ExplosionList from "../../../instancelist/ExplosionList";
import LenyaGrenadeExplosion from "../explosions/LenyaGrenadeExplosion";

export default class LenyaGrenade extends Projectile {

    override index = ProjectileList.LenyaGrenade;

    override onDestroy() {
        this.owner.abilities[2].forceCooldown();
        this.owner.game.addExplosion(LenyaGrenadeExplosion, this.owner,
            this.x, this.y,
            300, 40);
    }

}