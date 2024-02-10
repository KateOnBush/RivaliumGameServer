import EBufferType from "../../../enums/EBufferType";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import {UDPServerResponse} from "../../../enums/UDPPacketTypes";
import {ComponentID} from "../../../database/match/MatchTypes";
import UDPPacket from "../UDPPacket";

export default class UResEntityUpdate extends UDPPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("entityId", EBufferType.UInt16)
        .add("ownerId", EBufferType.UInt16)
        .add("x", EBufferType.SInt32, 100)
        .add("y", EBufferType.SInt32, 100)
        .add("movX", EBufferType.SInt32, 100)
        .add("movY", EBufferType.SInt32, 100)
        .add("health", EBufferType.UInt16)
        .add("armor", EBufferType.UInt8, 100)
        .add("param1", EBufferType.SInt32, 100)
        .add("param2", EBufferType.SInt32, 100)
        .add("param3", EBufferType.SInt32, 100)
        .add("param4", EBufferType.SInt32, 100)
        .add("param5", EBufferType.SInt32, 100)
        .build();
    static override index = UDPServerResponse.ENTITY_UPDATE;

    entityId: ComponentID;
    ownerId: ComponentID;
    x: number;
    y: number;
    movX: number;
    movY: number;
    health: number;
    armor: number;
    param1: number;
    param2: number;
    param3: number;
    param4: number;
    param5: number;

}