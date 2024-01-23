import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import {TCPServerRequest, TCPServerResponse} from "../../../enums/TCPPacketTypes";
import {EPreMatchState} from "../../../enums/EPreMatchState";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import {PlayerID} from "../../../database/match/MatchTypes";
import ProjectileList from "../../../gamedata/instancelist/ProjectileList";
import {NumericBoolean} from "../../../types/GameTypes";

export default class TResExplosionCreate extends FormattedPacket {

    channel = EPacketChannel.TCP;
    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("ownerId", EBufferType.UInt16)
        .add("explosionIndex", EBufferType.UInt16)
        .add("x", EBufferType.SInt32, 100)
        .add("y", EBufferType.SInt32, 100)
        .add("radius", EBufferType.UInt16)
        .add("damage", EBufferType.UInt16)
        .build();
    index: TCPServerResponse.PROJECTILE_DESTROY;

    ownerId: number;
    explosionIndex: number;
    x: number;
    y: number;
    radius: number;
    damage: number;

}