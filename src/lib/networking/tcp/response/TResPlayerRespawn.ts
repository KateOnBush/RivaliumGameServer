import EBufferType from "../../../enums/EBufferType";
import {TCPServerResponse} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import {PlayerID} from "../../../database/match/MatchTypes";
import TCPPacket from "../TCPPacket";

export default class TResPlayerRespawn extends TCPPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("playerId", EBufferType.UInt16)
        .build();
    static override index = TCPServerResponse.PLAYER_RESPAWN;

    playerId: PlayerID = 0;

}