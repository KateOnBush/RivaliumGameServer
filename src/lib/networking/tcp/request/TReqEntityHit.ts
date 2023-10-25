import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import {TCPServerRequest} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";

export default class TReqEntityHit extends FormattedPacket {

    channel = EPacketChannel.TCP;
    attributes = new FormattedPacketAttributeListBuilder()
        .add("projectileId", EBufferType.UInt16)
        .add("entityId", EBufferType.UInt16)
        .build();
    index: TCPServerRequest.ENTITY_HIT;

    projectileId: number = 0;
    entityId: number = 0;

}