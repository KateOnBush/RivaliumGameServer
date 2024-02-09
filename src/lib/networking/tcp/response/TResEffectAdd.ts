import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import {TCPServerResponse} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import {PlayerEffect} from "../../../components/Player";
import {PlayerID} from "../../../database/match/MatchTypes";
import TCPPacket from "../TCPPacket";

export default class TResEffectAdd extends TCPPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("playerId", EBufferType.UInt16)
        .add("type", EBufferType.UInt8)
        .add("duration", EBufferType.UInt16, 100)
        .add("multiplier", EBufferType.UInt16, 100)
        .build();
    static override index = TCPServerResponse.EFFECT_ADD;

    playerId: PlayerID = 0;
    type: PlayerEffect = PlayerEffect.NONE;
    duration: number = 0;
    multiplier: number;

}