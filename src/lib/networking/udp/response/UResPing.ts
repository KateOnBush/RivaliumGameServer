import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import {NumericBoolean} from "../../../types/GameTypes";
import {UDPServerResponse} from "../../../enums/UDPPacketTypes";
import UDPPacket from "../UDPPacket";

export default class UResPing extends UDPPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("requesting", EBufferType.UInt8)
        .add("ping", EBufferType.UInt16)
        .build();
    static override index = UDPServerResponse.PING;

    requesting: NumericBoolean = 0;
    ping: number = 0;

}