import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import {TCPServerRequest, TCPServerResponse} from "../../../enums/TCPPacketTypes";
import {EPreMatchState} from "../../../enums/EPreMatchState";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import {PlayerID} from "../../../database/match/MatchTypes";
import ProjectileList from "../../../gamedata/instancelist/ProjectileList";
import {NumericBoolean} from "../../../types/GameTypes";
import TCPPacket from "../TCPPacket";

export default class TResProjectileCreate extends TCPPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("ownerId", EBufferType.UInt16)
        .add("projId", EBufferType.UInt16)
        .add("projIndex", EBufferType.UInt16)
        .add("x", EBufferType.SInt32, 100)
        .add("y", EBufferType.SInt32, 100)
        .add("oldY", EBufferType.SInt32, 100)
        .add("oldX", EBufferType.SInt32, 100)
        .add("speed", EBufferType.SInt32, 100)
        .add("direction", EBufferType.SInt16, 10)
        .add("collision", EBufferType.UInt8).asBoolean()
        .add("dieOnCollision", EBufferType.UInt8).asBoolean()
        .add("bounce", EBufferType.UInt8).asBoolean()
        .add("hasWeight", EBufferType.UInt8).asBoolean()
        .add("bounceFriction", EBufferType.UInt8, 100)
        .add("lifespan", EBufferType.UInt8)
        .add("damage", EBufferType.UInt16)
        .add("bleed", EBufferType.UInt16)
        .add("heal", EBufferType.UInt16)
        .build();
    static override index = TCPServerResponse.PROJECTILE_CREATE;

    ownerId: PlayerID = 0;
    projIndex: ProjectileList;
    projId: number;
    x: number = 0;
    y: number = 0;
    oldX: number = 0;
    oldY: number = 0;
    speed: number = 0;
    direction: number = 0;
    collision: NumericBoolean;
    dieOnCollision: NumericBoolean;
    bounce: NumericBoolean;
    hasWeight: NumericBoolean;
    lifespan: number;
    damage: number;
    bleed: number;
    heal: number;
    bounceFriction: number;

}