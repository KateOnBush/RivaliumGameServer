import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import {TCPServerRequest} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import EPlayerState from "../../../enums/EPlayerState";
import {NumericBoolean, SignedNumericBoolean} from "../../../types/GameTypes";
import {UDPServerRequest, UDPServerResponse} from "../../../enums/UDPPacketTypes";
import UResPlayerFlip from "../response/UResPlayerFlip";
import Player from "../../../components/Player";
import UDPIncomingPacket from "../UDPIncomingPacket";
import UDPPlayerSocket from "../UDPPlayerSocket";

export default class UReqFlip extends UDPIncomingPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("forward", EBufferType.UInt8)
        .add("start", EBufferType.UInt8, 100)
        .build();
    static override index = UDPServerRequest.FLIP;

    forward: number;
    start: number;

    handle(socket: UDPPlayerSocket) {
        if (!socket.identified || !socket.player) return;
        const sender = socket.player;
        let flip = new UResPlayerFlip();
        flip.forward = this.forward;
        flip.start = this.start;
        sender.game.broadcastExcept(flip, sender);
    }



}