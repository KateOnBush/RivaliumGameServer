import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import {TCPServerRequest} from "../../../enums/TCPPacketTypes";

export default class TReqIdentify extends FormattedPacket {

    channel = EPacketChannel.TCP;
    data: [string, EBufferType][] = [
        ["pass", EBufferType.UInt16],
        ["access", EBufferType.UInt16]
    ];
    index: TCPServerRequest.IDENTIFY;

    pass: number;
    access: number;

}