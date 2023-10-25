import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import {TCPServerRequest} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";

export default class TReqPlayerHit extends FormattedPacket {

    channel = EPacketChannel.TCP;
    attributes = new FormattedPacketAttributeListBuilder()
        .add("projectileId", EBufferType.UInt16)
        .add("objectId", EBufferType.UInt32)
        .add("hitId", EBufferType.UInt16)
        .add("x", EBufferType.SInt32, 100)
        .add("y", EBufferType.SInt32, 100)
        .build();
    index: TCPServerRequest.PLAYER_HIT;

    projectileId: number = 0;
    objectId: number = 0;
    hitId: number = 0;
    x: number = 0;
    y: number = 0;

}