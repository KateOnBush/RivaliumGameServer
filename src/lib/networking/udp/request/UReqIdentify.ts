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
import UDPPlayerSocket from "../UDPPlayerSocket";
import UDPIncomingPacket from "../UDPIncomingPacket";

export default class UReqFlip extends UDPIncomingPacket{

    static override channel = EPacketChannel.UDP;
    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("pass", EBufferType.UInt16)
        .build();
    static override index = UDPServerRequest.IDENTIFY;

    pass: number;

    handle(socket: UDPPlayerSocket) {



    }



}