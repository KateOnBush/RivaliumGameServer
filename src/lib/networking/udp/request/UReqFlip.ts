import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import {TCPServerRequest} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import EPlayerState from "../../../enums/EPlayerState";
import {NumericBoolean, SignedNumericBoolean} from "../../../types/GameTypes";
import {UDPServerRequest, UDPServerResponse} from "../../../enums/UDPPacketTypes";

export default class UReqPositionUpdate extends FormattedPacket {

    channel = EPacketChannel.UDP;
    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("forward", EBufferType.UInt8)
        .add("start", EBufferType.UInt8, 100)
        .build();
    index: UDPServerRequest.GRAPPLING_POSITION;

    forward: number;
    start: number;

}