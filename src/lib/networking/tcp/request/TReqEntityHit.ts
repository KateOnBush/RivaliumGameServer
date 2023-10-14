import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import {TCPServerRequest} from "../../../enums/TCPPacketTypes";

export default class TReqEntityHit extends FormattedPacket {

    channel = EPacketChannel.TCP;
    data: [string, EBufferType][] = [
        ["projectileId", EBufferType.UInt16],
        ["entityId", EBufferType.UInt16]
    ];
    index: TCPServerRequest.ENTITY_HIT;

    projectileId: number = 0;
    entityId: number = 0;

}