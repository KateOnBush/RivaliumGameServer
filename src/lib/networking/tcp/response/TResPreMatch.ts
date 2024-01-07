import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import {TCPServerRequest, TCPServerResponse} from "../../../enums/TCPPacketTypes";
import {EPreMatchState} from "../../../enums/EPreMatchState";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";

export default class TResPreMatch extends FormattedPacket {

    channel = EPacketChannel.TCP;
    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("state", EBufferType.UInt8)
        .add("playerId", EBufferType.UInt8)
        .build();
    index: TCPServerResponse.PRE_MATCH;

    state: EPreMatchState = 0;
    playerId: number = 0;

}