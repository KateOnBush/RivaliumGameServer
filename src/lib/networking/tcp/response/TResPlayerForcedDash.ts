import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import EBufferType from "../../../enums/EBufferType";
import {PlayerID} from "../../../database/match/MatchTypes";
import {TCPServerResponse} from "../../../enums/TCPPacketTypes";
import TCPPacket from "../TCPPacket";

export default class TResPlayerForcedDash extends TCPPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("playerId", EBufferType.UInt16)
        .add("direction", EBufferType.SInt16, 100)
        .add("time", EBufferType.UInt16, 100)
        .add("mult", EBufferType.UInt16, 100)
        .build();
    static override index = TCPServerResponse.PLAYER_FORCED_DASH;

    playerId: PlayerID;
    direction: number;
    time: number;
    mult: number;

}