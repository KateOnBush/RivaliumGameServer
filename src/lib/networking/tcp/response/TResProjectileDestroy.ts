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

export default class TResProjectileDestroy extends TCPPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("projId", EBufferType.UInt16)
        .build();
    static override index = TCPServerResponse.PROJECTILE_DESTROY;

    projId: number;

}