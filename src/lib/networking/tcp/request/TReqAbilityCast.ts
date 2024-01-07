import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import {TCPServerRequest} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";

export default class TReqAbilityCast extends FormattedPacket {

    channel = EPacketChannel.TCP;
    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("ability", EBufferType.UInt8)
        .add("abilityN", EBufferType.UInt8)
        .build();
    index: TCPServerRequest.ABILITY_CAST;

    ability: number = 0;
    abilityN: number = 0;

}