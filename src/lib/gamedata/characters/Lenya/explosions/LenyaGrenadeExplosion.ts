import Explosion from "../../../../components/Explosion";
import ExplosionList from "../../../instancelist/ExplosionList";

export default class LenyaGrenadeExplosion extends Explosion {

    override index = ExplosionList.LenyaGrenade;

    override onTrigger() {
        this.playersInShockwaveRadius.forEach(player => {
            if (player.team == this.owner.team) {
                player.healInstantly(50, this.owner);
            }
        })
    }

}