import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import {TCPServerRequest} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import EPlayerState from "../../../enums/EPlayerState";
import {NumericBoolean, SignedNumericBoolean} from "../../../types/GameTypes";
import {UDPServerRequest, UDPServerResponse} from "../../../enums/UDPPacketTypes";
import IncomingPacket from "../../../interfaces/IncomingPacket";
import Player from "../../../components/Player";
import UResPlayerGrapple from "../response/UResPlayerGrapple";

export default class UReqGrapplingPosition extends FormattedPacket implements IncomingPacket {

    channel = EPacketChannel.UDP;
    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("x", EBufferType.SInt32, 100)
        .add("y", EBufferType.SInt32, 100)
        .add("grappled", EBufferType.UInt8)
        .build();
    index: UDPServerRequest.GRAPPLING_POSITION;

    x: number;
    y: number;
    grappled: number;

    handle(sender: Player) {
        let grapple = new UResPlayerGrapple();
        grapple.x = this.x; grapple.y = this.y;
        grapple.grappled = this.grappled;
        sender.game.broadcastExcept(grapple, sender);
    }

}