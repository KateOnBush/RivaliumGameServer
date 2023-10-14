import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import {TCPServerRequest} from "../../../enums/TCPPacketTypes";

export default class TReqAbilityCast extends FormattedPacket {

    channel = EPacketChannel.TCP;
    data: [string, EBufferType][] = [
        ["ability", EBufferType.UInt8],
        ["abilityN", EBufferType.UInt8]
    ];
    index: TCPServerRequest.ABILITY_CAST;

    ability: number = 0;
    abilityN: number = 0;

}