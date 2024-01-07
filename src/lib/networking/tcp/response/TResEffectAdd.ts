import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import {TCPServerResponse} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import {PlayerEffect} from "../../../components/Player";

export default class TResEffectAdd extends FormattedPacket {

    channel = EPacketChannel.TCP;
    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("id", EBufferType.UInt16)
        .add("type", EBufferType.UInt8)
        .add("duration", EBufferType.UInt16, 100)
        .build();
    index: TCPServerResponse.EFFECT_ADD;

    id: number = 0;
    type: PlayerEffect = PlayerEffect.NONE;
    duration: number = 0;

}