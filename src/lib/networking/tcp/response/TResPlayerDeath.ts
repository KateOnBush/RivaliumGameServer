import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import {TCPServerResponse} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import {PlayerID} from "../../../database/match/MatchTypes";

export default class TResPlayerDeath extends FormattedPacket {

    channel = EPacketChannel.TCP;
    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("killer", EBufferType.UInt16)
        .add("victim", EBufferType.UInt16)
        .build();
    index: TCPServerResponse.PLAYER_DEATH;

    killer: PlayerID;
    victim: PlayerID;

}