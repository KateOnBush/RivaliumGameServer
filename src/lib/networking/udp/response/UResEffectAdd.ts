import EBufferType from "../../../enums/EBufferType";
import {TCPServerResponse} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import {PlayerEffect} from "../../../components/Player";
import {PlayerID} from "../../../database/match/MatchTypes";
import UDPPacket from "../UDPPacket";
import {UDPServerResponse} from "../../../enums/UDPPacketTypes";

export default class UResEffectAdd extends UDPPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("playerId", EBufferType.UInt16)
        .add("type", EBufferType.UInt8)
        .add("duration", EBufferType.UInt16, 100)
        .build();
    static override index = UDPServerResponse.PLAYER_EFFECT_ADD;

    playerId: PlayerID = 0;
    type: PlayerEffect = PlayerEffect.NONE;
    duration: number = 0;

}