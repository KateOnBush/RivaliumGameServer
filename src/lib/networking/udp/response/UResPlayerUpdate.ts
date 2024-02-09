import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import {UDPServerResponse} from "../../../enums/UDPPacketTypes";
import {PlayerID} from "../../../database/match/MatchTypes";
import EPlayerState from "../../../enums/EPlayerState";
import CharacterList from "../../../gamedata/CharacterList";
import {NumericBoolean, SignedNumericBoolean} from "../../../types/GameTypes";
import UDPPacket from "../UDPPacket";

export default class UResPlayerUpdate extends UDPPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("playerId", EBufferType.UInt16)
        .add("stateId", EBufferType.UInt8)
        .add("x", EBufferType.SInt32, 100)
        .add("y", EBufferType.SInt32, 100)
        .add("movX", EBufferType.SInt32, 100)
        .add("movY", EBufferType.SInt32, 100)
        .add("mouseX", EBufferType.SInt32, 100)
        .add("mouseY", EBufferType.SInt32, 100)
        .add("onGround", EBufferType.UInt8).asBoolean()
        .add("slide", EBufferType.UInt8).asBoolean()
        .add("direction", EBufferType.UInt8).asBoolean()
        .add("characterId", EBufferType.UInt8)
        .add("characterHealth", EBufferType.UInt16)
        .add("characterMaxHealth", EBufferType.UInt16)
        .add("characterUltimateCharge", EBufferType.UInt16)
        .add("characterMaxUltimateCharge", EBufferType.UInt16)
        .build();
    static override index = UDPServerResponse.PLAYER_UPDATE;

    playerId: PlayerID;
    x: number;
    y: number;
    movX: number;
    movY: number;
    mouseX: number;
    mouseY: number;

    stateId: EPlayerState;

    characterId: CharacterList;
    characterHealth: number;
    characterUltimateCharge: number;
    characterMaxHealth: number;
    characterMaxUltimateCharge: number;

    onGround: NumericBoolean;
    slide: NumericBoolean;
    direction: NumericBoolean;

}