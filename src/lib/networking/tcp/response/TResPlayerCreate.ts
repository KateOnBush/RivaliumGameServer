import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import {TCPServerResponse} from "../../../enums/TCPPacketTypes";
import {EPreMatchState} from "../../../enums/EPreMatchState";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";

export default class TResPlayerCreate extends FormattedPacket {

    channel = EPacketChannel.TCP;
    attributes = new FormattedPacketAttributeListBuilder()
        .add("id", EBufferType.UInt16)
        .add("isYou", EBufferType.UInt8)
        .add("characterId", EBufferType.UInt8)
        .add("characterHealth", EBufferType.UInt16)
        .add("characterUltimateCharge", EBufferType.UInt16)
        .add("characterMaxHealth", EBufferType.UInt16)
        .add("characterMaxUltimateCharge", EBufferType.UInt16)
        .add("x", EBufferType.SInt32, 100)
        .add("y", EBufferType.SInt32, 100)
        .build();
    index: TCPServerResponse.PLAYER_CREATE;

    state: EPreMatchState = 0;
    playerId: number = 0;

}