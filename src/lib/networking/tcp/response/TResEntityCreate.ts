import EBufferType from "../../../enums/EBufferType";
import {TCPServerResponse} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import TCPPacket from "../TCPPacket";

export default class TResEntityCreate extends TCPPacket {

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
        .add("param1", EBufferType.SInt32, 100)
        .add("param2", EBufferType.SInt32, 100)
        .add("param3", EBufferType.SInt32, 100)
        .add("param4", EBufferType.SInt32, 100)
        .add("param5", EBufferType.SInt32, 100)
        .build();
    static override index = TCPServerResponse.PROJECTILE_DESTROY;

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
    param1: number;
    param2: number;
    param3: number;
    param4: number;
    param5: number;

}