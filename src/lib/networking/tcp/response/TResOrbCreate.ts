import EBufferType from "../../../enums/EBufferType";
import {TCPServerResponse} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import TCPPacket from "../TCPPacket";
import {OrbType} from "../../../gamedata/general/ElementalOrb";

export default class TResOrbCreate extends TCPPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("entityId", EBufferType.UInt16)
        .add("ownerId", EBufferType.UInt16)
        .add("orbType", EBufferType.UInt8)
        .add("x", EBufferType.SInt32, 100)
        .add("y", EBufferType.SInt32, 100)
        .add("lifespan", EBufferType.UInt8)
        .build();
    static override index = TCPServerResponse.ORB_CREATE;

    entityId: number;
    ownerId: number;
    x: number;
    y: number;
    orbType: OrbType;
    lifespan: number;

}