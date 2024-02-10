import EBufferType from "../../../enums/EBufferType";
import {TCPServerRequest} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import TCPIncomingPacket from "../TCPIncomingPacket";
import TCPPlayerSocket from "../TCPPlayerSocket";

export default class TReqEntityHit extends TCPIncomingPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("projectileId", EBufferType.UInt16)
        .add("entityId", EBufferType.UInt16)
        .build();
    static override index = TCPServerRequest.ENTITY_HIT;

    projectileId: number = 0;
    entityId: number = 0;

    handle(socket: TCPPlayerSocket) {

        if(!socket.identified || !socket.player) return;
        const sender = socket.player;

        let damagedEntity = sender.game.getEntity(this.entityId);
        let damagingProjectile = sender.game.getProjectile(this.projectileId);
        if (!damagedEntity) return;
        if (!damagingProjectile) return;

        damagedEntity.hit(damagingProjectile.damage, sender.player);
        if (damagingProjectile.dieOnCol) damagingProjectile.destroy();

    }

}