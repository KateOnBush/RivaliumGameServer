import EBufferType from "../../../enums/EBufferType";
import {TCPServerResponse} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import TCPPacket from "../TCPPacket";

export default class TResExplosionCreate extends TCPPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("ownerId", EBufferType.UInt16)
        .add("explosionIndex", EBufferType.UInt16)
        .add("x", EBufferType.SInt32, 100)
        .add("y", EBufferType.SInt32, 100)
        .add("radius", EBufferType.UInt16)
        .add("damage", EBufferType.UInt16)
        .build();
    static override index = TCPServerResponse.PROJECTILE_DESTROY;

    ownerId: number;
    explosionIndex: number;
    x: number;
    y: number;
    radius: number;
    damage: number;

}