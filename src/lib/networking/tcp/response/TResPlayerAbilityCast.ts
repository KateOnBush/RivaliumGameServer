import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import {TCPServerResponse} from "../../../enums/TCPPacketTypes";
import {EPreMatchState} from "../../../enums/EPreMatchState";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";

export default class TResPlayerAbilityCast extends FormattedPacket {

    channel = EPacketChannel.TCP;
    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("id", EBufferType.UInt16)
        .add("ability", EBufferType.UInt8)
        .add("abilityN", EBufferType.UInt8)
        .build();
    index: TCPServerResponse.PLAYER_HIT;

    state: EPreMatchState = 0;

    id: number = 0;
    ability: number = 0;
    abilityN: number = 0;

}