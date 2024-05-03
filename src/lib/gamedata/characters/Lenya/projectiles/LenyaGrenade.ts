import Projectile from "../../../../components/Projectile";
import ProjectileList from "../../../instancelist/ProjectileList";
import ExplosionList from "../../../instancelist/ExplosionList";

export default class LenyaGrenade extends Projectile {

    override id = ProjectileList.LenyaGrenade;

    override onDestroy() {
        this.owner.char.abilities[2].forceCooldown();
        this.owner.game.addExplosion(this.owner,
            ExplosionList.LenyaGrenade,
            this.x, this.y,
            300, 40);
    }

}