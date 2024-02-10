import EBufferType from "../../../enums/EBufferType";
import {TCPServerResponse} from "../../../enums/TCPPacketTypes";
import {EPreMatchState} from "../../../enums/EPreMatchState";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import TCPPacket from "../TCPPacket";

export default class TResPlayerAbilityCast extends TCPPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("id", EBufferType.UInt16)
        .add("ability", EBufferType.UInt8)
        .add("abilityN", EBufferType.UInt8)
        .build();
    static override index = TCPServerResponse.PLAYER_HIT;

    state: EPreMatchState = 0;

    id: number = 0;
    ability: number = 0;
    abilityN: number = 0;

}