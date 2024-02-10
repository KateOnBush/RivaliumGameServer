import EBufferType from "../../../enums/EBufferType";
import {TCPServerResponse} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import {PlayerID} from "../../../database/match/MatchTypes";
import TCPPacket from "../TCPPacket";

export default class TResPlayerDeath extends TCPPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("killer", EBufferType.UInt16)
        .add("victim", EBufferType.UInt16)
        .build();
    static override index = TCPServerResponse.PLAYER_DEATH;

    killer: PlayerID;
    victim: PlayerID;

}