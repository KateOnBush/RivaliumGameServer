import EBufferType from "../../../enums/EBufferType";
import {TCPServerResponse} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import TCPPacket from "../TCPPacket";

export default class TResPlayerStatsUpdate extends TCPPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("playerId", EBufferType.UInt16)
        .add("kills", EBufferType.UInt16)
        .add("deaths", EBufferType.UInt16)
        .add("assists", EBufferType.UInt16)
        .add("gemPlants", EBufferType.UInt16)
        .build();
    static override index = TCPServerResponse.PLAYER_STATS_UPDATE;

    playerId: number = 0;
    kills: number = 0;
    deaths: number = 0;
    assists: number = 0;
    gemPlants: number = 0;


}