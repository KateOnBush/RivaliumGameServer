import EBufferType from "../../../enums/EBufferType";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import {UDPServerResponse} from "../../../enums/UDPPacketTypes";
import {PlayerID} from "../../../database/match/MatchTypes";
import UDPPacket from "../UDPPacket";

export default class UResProjectileUpdate extends UDPPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("projectileId", EBufferType.UInt16)
        .add("x", EBufferType.SInt32, 100)
        .add("y", EBufferType.SInt32, 100)
        .add("movX", EBufferType.SInt32, 100)
        .add("movY", EBufferType.SInt32, 100)
        .build();
    static override index = UDPServerResponse.PROJECTILE_UPDATE;

    projectileId: PlayerID;
    x: number;
    y: number;
    movX: number;
    movY: number;

}