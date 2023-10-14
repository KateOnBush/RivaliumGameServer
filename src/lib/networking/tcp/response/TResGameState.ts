import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import {TCPServerRequest, TCPServerResponse} from "../../../enums/TCPPacketTypes";
import {EPreMatchState} from "../../../enums/EPreMatchState";

export default class TResGameState extends FormattedPacket {

    channel = EPacketChannel.TCP;
    data: [string, EBufferType][] = [
        ["state", EBufferType.UInt8],
        ["playerId", EBufferType.UInt8]
    ];
    index: TCPServerResponse.GAME_STATE;

    state: EPreMatchState = 0;
    playerId: number = 0;

}