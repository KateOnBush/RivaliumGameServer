import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import {TCPServerRequest} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";

export default class TReqIdentify extends FormattedPacket {

    channel = EPacketChannel.TCP;
    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("pass", EBufferType.UInt16)
        .add("access", EBufferType.UInt16)
        .build();
    index: TCPServerRequest.IDENTIFY;

    pass: number;
    access: number;

}