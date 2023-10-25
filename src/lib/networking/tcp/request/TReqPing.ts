import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import {TCPServerRequest} from "../../../enums/TCPPacketTypes";

export default class TReqPing extends FormattedPacket {

    channel = EPacketChannel.TCP;
    attributes = [];
    index: TCPServerRequest.PING;

}