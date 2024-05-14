import Projectile from "../../../../components/Projectile";
import Entity from "../../../../components/Entity";
import EntityList from "../../../instancelist/EntityList";

export default class MasrCloud extends Entity {

    override index = EntityList.MasrCloud;

    override onHit(projectile: Projectile) {
        projectile.cancel();
    }

}