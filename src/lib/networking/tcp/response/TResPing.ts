import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import {TCPServerResponse} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import {PlayerEffect} from "../../../components/Player";
import {NumericBoolean} from "../../../types/GameTypes";

export default class TResEffectAdd extends FormattedPacket {

    channel = EPacketChannel.TCP;
    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("requesting", EBufferType.UInt8)
        .add("ping", EBufferType.UInt8)
        .build();
    index: TCPServerResponse.EFFECT_ADD;

    requesting: NumericBoolean = 0;
    ping: number = 0;

}