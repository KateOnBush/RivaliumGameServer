import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import {TCPServerResponse} from "../../../enums/TCPPacketTypes";
import {EPreMatchState} from "../../../enums/EPreMatchState";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import {PlayerID} from "../../../database/match/MatchTypes";
import {NumericBoolean} from "../../../types/GameTypes";
import CharacterList from "../../../gamedata/CharacterList";
import TCPPacket from "../TCPPacket";

export default class TResPlayerCreate extends TCPPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("playerId", EBufferType.UInt16)
        .add("isYou", EBufferType.UInt8)
        .add("characterId", EBufferType.UInt8)
        .add("characterHealth", EBufferType.UInt16)
        .add("characterUltimateCharge", EBufferType.UInt16)
        .add("characterMaxHealth", EBufferType.UInt16)
        .add("characterMaxUltimateCharge", EBufferType.UInt16)
        .add("x", EBufferType.SInt32, 100)
        .add("y", EBufferType.SInt32, 100)
        .build();
    static override index = TCPServerResponse.PLAYER_CREATE;

    playerId: PlayerID;
    isYou: NumericBoolean;
    characterId: CharacterList;
    characterHealth: number;
    characterUltimateCharge: number;
    characterMaxHealth: number;
    characterMaxUltimateCharge: number;
    x: number;
    y: number;

}