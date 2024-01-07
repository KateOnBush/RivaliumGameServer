import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import {TCPServerResponse} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";

export default class TResEntityCreate extends FormattedPacket {

    channel = EPacketChannel.TCP;
    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("entityIndex", EBufferType.UInt16)
        .add("entityId", EBufferType.UInt16)
        .add("ownerId", EBufferType.UInt16)
        .add("x", EBufferType.SInt32, 100)
        .add("y", EBufferType.SInt32, 100)
        .add("mx", EBufferType.SInt32, 100)
        .add("my", EBufferType.SInt32, 100)
        .add("health", EBufferType.UInt32)
        .add("armor", EBufferType.UInt8, 100)
        .add("lifespan", EBufferType.UInt8)
        .build();
    index: TCPServerResponse.PROJECTILE_DESTROY;

    entityIndex: number;
    entityId: number;
    ownerId: number;
    x: number;
    y: number;
    mx: number;
    my: number;
    health: number;
    armor: number;
    lifespan: number;

}