import EBufferType from "../../../enums/EBufferType";
import {TCPServerRequest} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import TCPIncomingPacket from "../TCPIncomingPacket";
import TCPPlayerSocket from "../TCPPlayerSocket";

export default class TReqPlayerHit extends TCPIncomingPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("projectileId", EBufferType.UInt16)
        .add("objectId", EBufferType.UInt32)
        .add("hitId", EBufferType.UInt16)
        .add("x", EBufferType.SInt32, 100)
        .add("y", EBufferType.SInt32, 100)
        .build();
    static override index = TCPServerRequest.PLAYER_HIT;

    projectileId: number = 0;
    objectId: number = 0;
    hitId: number = 0;
    x: number = 0;
    y: number = 0;

    handle(socket: TCPPlayerSocket): void {

        if(!socket.identified || !socket.player) return;
        const sender = socket.player;

        let proj;

        if (this.projectileId != 0) {
            proj = sender.game.getProjectile(this.projectileId);
        }

        if (!proj) return;
        proj.pos.x = this.x;
        proj.pos.y = this.y;

        let playerHit = sender.game.getPlayer(this.hitId);
        if (playerHit) {
            playerHit.hit(proj.damage, sender);
            if (proj.bleed > 0)
                playerHit.burn(proj.bleed, sender);
            if (proj.heal > 0)
                sender.healInstantly(proj.heal);
        }

        proj.destroy();

    }

}