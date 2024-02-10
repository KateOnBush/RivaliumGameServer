import EBufferType from "../../../enums/EBufferType";
import {TCPServerResponse} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import {EGameState} from "../../../enums/EGameData";
import TCPPacket from "../TCPPacket";

export default class TResGameState extends TCPPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("state", EBufferType.UInt8)
        .add("currentRound", EBufferType.UInt8)
        .add("timer", EBufferType.UInt8)
        .build();
    static override index = TCPServerResponse.GAME_STATE;

    state: EGameState = 0;
    currentRound: number = 0;
    timer: number = 0;

}