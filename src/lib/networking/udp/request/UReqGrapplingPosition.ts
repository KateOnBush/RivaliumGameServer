import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import {TCPServerRequest} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import EPlayerState from "../../../enums/EPlayerState";
import {NumericBoolean, SignedNumericBoolean} from "../../../types/GameTypes";
import {UDPServerRequest, UDPServerResponse} from "../../../enums/UDPPacketTypes";
import Player from "../../../components/Player";
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