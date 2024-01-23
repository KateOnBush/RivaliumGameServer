import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import {TCPServerRequest, TCPServerResponse} from "../../../enums/TCPPacketTypes";
import {EPreMatchState} from "../../../enums/EPreMatchState";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import {EGameState} from "../../../enums/EGameData";

export default class TResGameState extends FormattedPacket {

    channel = EPacketChannel.TCP;
    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("state", EBufferType.UInt8)
        .add("currentRound", EBufferType.UInt8)
        .add("timer", EBufferType.UInt8)
        .build();
    index: TCPServerResponse.GAME_STATE;

    state: EGameState = 0;
    currentRound: number = 0;
    timer: number = 0;

}