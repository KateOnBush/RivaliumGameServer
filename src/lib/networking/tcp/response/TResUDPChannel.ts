import TCPIncomingPacket from "../TCPIncomingPacket";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import EBufferType from "../../../enums/EBufferType";
import TCPPacket from "../TCPPacket";
import {TCPServerResponse} from "../../../enums/TCPPacketTypes";

export default class TResUDPChannel extends TCPPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("identifier", EBufferType.UInt32)
        .build();

    static override index = TCPServerResponse.UDP_CHANNEL_IDENTIFY;

    identifier: number;

}