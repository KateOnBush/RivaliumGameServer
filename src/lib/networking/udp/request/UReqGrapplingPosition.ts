import EBufferType from "../../../enums/EBufferType";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import {UDPServerRequest} from "../../../enums/UDPPacketTypes";
import UResPlayerGrapple from "../response/UResPlayerGrapple";
import UDPIncomingPacket from "../UDPIncomingPacket";
import UDPPlayerSocket from "../UDPPlayerSocket";

export default class UReqGrapplingPosition extends UDPIncomingPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("x", EBufferType.SInt32, 100)
        .add("y", EBufferType.SInt32, 100)
        .add("grappled", EBufferType.UInt8)
        .build();
    static override index = UDPServerRequest.GRAPPLING_POSITION;

    x: number;
    y: number;
    grappled: number;

    handle(socket: UDPPlayerSocket) {
        if (!socket.identified || !socket.player) return;
        const sender = socket.player;
        let grapple = new UResPlayerGrapple();
        grapple.x = this.x; grapple.y = this.y;
        grapple.grappled = this.grappled;
        sender.game.broadcastExcept(grapple, sender);
    }

}