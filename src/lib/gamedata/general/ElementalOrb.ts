import Entity from "../../components/Entity";
import Player from "../../components/Player";
import GM from "../../tools/GMLib";
import Vector2 from "../../tools/vector/Vector2";
import TResOrbPickup from "../../networking/tcp/response/TResOrbPickup";

export enum OrbType {
    LETHALITY,
    RESISTANCE,
    HASTE
}

export default class ElementalOrb extends Entity {

    type: OrbType = OrbType.LETHALITY;

    pickedUp: boolean = false;

    pickedUpBy: Player;
    pickupBlend: number = 0;

    justSpawned: number = 1.5;

    override step(dt: number) {
        if (this.pickedUp) {
            this.pickupBlend = GM.dtlerp(this.pickupBlend, 1, 0.005 + this.pickupBlend * 0.03, dt);
            if (this.pickupBlend > 0.9) {
                switch (this.type) {
                    case OrbType.LETHALITY:
                        if (this.pickedUpBy.lethality < 10) this.pickedUpBy.lethality++;
                        break;
                    case OrbType.RESISTANCE:
                        if (this.pickedUpBy.resistance < 10) this.pickedUpBy.resistance++;
                        break;
                    case OrbType.HASTE:
                        if (this.pickedUpBy.haste < 10) this.pickedUpBy.haste++;
                        break;
                }
                this.destroy();
            }
        } else {
            this.justSpawned -= dt/60;
            if (this.justSpawned > 0) return;
            for(const player of this.game.players){
                if (!player.dead && Vector2.subtract(player.pos, this.pos).magnitude() < 400) {
                    if ((this.type == OrbType.LETHALITY && player.lethality == 10) ||
                        (this.type == OrbType.RESISTANCE && player.resistance == 10) ||
                        (this.type == OrbType.HASTE && player.haste == 10)) continue;
                    this.pickup(player)
                    break;
                }
            }
        }
    }

    pickup(player: Player) {
        this.pickedUp = true;
        this.pickedUpBy = player;
        let orbPickup = new TResOrbPickup();
        orbPickup.playerId = player.id;
        orbPickup.entityId = this.id;
        this.game.broadcast(orbPickup);
    }

}