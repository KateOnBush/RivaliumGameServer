import EBufferType from "../../../enums/EBufferType";
import {TCPServerResponse} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import TCPPacket from "../TCPPacket";
import {OrbType} from "../../../gamedata/general/ElementalOrb";

export default class TResOrbPickup extends TCPPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("entityId", EBufferType.UInt16)
        .add("playerId", EBufferType.UInt16)
        .build();
    static override index = TCPServerResponse.ORB_PICKUP;

    entityId: number;
    playerId: number;

}