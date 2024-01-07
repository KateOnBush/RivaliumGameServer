import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import {TCPServerResponse} from "../../../enums/TCPPacketTypes";
import {EPreMatchState} from "../../../enums/EPreMatchState";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";

export default class TResPlayerHit extends FormattedPacket {

    channel = EPacketChannel.TCP;
    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("id", EBufferType.UInt16)
        .add("attackerId", EBufferType.UInt16)
        .add("visual", EBufferType.UInt8)
        .build();
    index: TCPServerResponse.PLAYER_HIT;

    id: number = 0;
    attackerId: number = 0;
    visual: number = 0;

}