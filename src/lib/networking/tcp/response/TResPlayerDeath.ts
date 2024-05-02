import EBufferType from "../../../enums/EBufferType";
import {TCPServerResponse} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import {PlayerID} from "../../../database/match/MatchTypes";
import TCPPacket from "../TCPPacket";

export default class TResPlayerDeath extends TCPPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("killer", EBufferType.UInt16)
        .add("victim", EBufferType.UInt16)
        .add("respawnTime", EBufferType.UInt16)
        .add("assist1", EBufferType.UInt16)
        .add("assist2", EBufferType.UInt16)
        .add("assist3", EBufferType.UInt16)
        .add("assist4", EBufferType.UInt16)
        .build();
    static override index = TCPServerResponse.PLAYER_DEATH;

    killer: PlayerID = 0;
    victim: PlayerID = 0;

    respawnTime: number = 0;

    assist1: PlayerID = 0;
    assist2: PlayerID = 0;
    assist3: PlayerID = 0;
    assist4: PlayerID = 0;

}