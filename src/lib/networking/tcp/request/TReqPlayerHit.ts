import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import {TCPServerRequest} from "../../../enums/TCPPacketTypes";

export default class TReqPlayerHit extends FormattedPacket {

    channel = EPacketChannel.TCP;
    data: [string, EBufferType][] = [
        ["projectileId", EBufferType.UInt16],
        ["objectId", EBufferType.UInt32],
        ["hitId", EBufferType.UInt16],
        ["x", EBufferType.SInt32],
        ["y", EBufferType.SInt32]
    ];
    index: TCPServerRequest.PLAYER_HIT;

    projectileId: number = 0;
    objectId: number = 0;
    hitId: number = 0;
    x: number = 0;
    y: number = 0;

}