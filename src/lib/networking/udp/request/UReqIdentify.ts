import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import {UDPServerRequest} from "../../../enums/UDPPacketTypes";
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