import EBufferType from "../../../enums/EBufferType";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import {UDPServerResponse} from "../../../enums/UDPPacketTypes";
import {PlayerID} from "../../../database/match/MatchTypes";
import EPlayerState from "../../../enums/EPlayerState";
import CharacterList from "../../../gamedata/CharacterList";
import {NumericBoolean} from "../../../types/GameTypes";
import UDPPacket from "../UDPPacket";

export default class UResPlayerUpdate extends UDPPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("counter", EBufferType.UInt32)
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
        .add("gemHolder", EBufferType.UInt8).asBoolean()
        .add("characterId", EBufferType.UInt8)
        .add("health", EBufferType.UInt16)
        .add("maxHealth", EBufferType.UInt16)
        .add("ultimateCharge", EBufferType.UInt16)
        .add("maxUltimateCharge", EBufferType.UInt16)
        .add("movementBoost", EBufferType.UInt16, 100)
        .add("ping", EBufferType.UInt16)
        .add("lethalityAndResistance", EBufferType.UInt8)
        .add("haste", EBufferType.UInt8)
        .build();
    static override index = UDPServerResponse.PLAYER_UPDATE;

    counter: number = 0;

    playerId: PlayerID;
    x: number;
    y: number;
    movX: number;
    movY: number;
    mouseX: number;
    mouseY: number;

    stateId: EPlayerState;

    characterId: CharacterList;
    health: number;
    ultimateCharge: number;
    maxHealth: number;
    maxUltimateCharge: number;

    onGround: NumericBoolean;
    slide: NumericBoolean;
    direction: NumericBoolean;
    gemHolder: NumericBoolean;

    movementBoost: number = 0;

    ping: number;

    lethalityAndResistance: number;
    haste: number;

}