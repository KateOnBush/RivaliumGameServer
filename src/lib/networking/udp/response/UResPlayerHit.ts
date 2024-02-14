import EBufferType from "../../../enums/EBufferType";
import {TCPServerResponse} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import UDPPacket from "../UDPPacket";
import {UDPServerResponse} from "../../../enums/UDPPacketTypes";

export default class UResPlayerHit extends UDPPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("playerId", EBufferType.UInt16)
        .add("attackerId", EBufferType.UInt16)
        .add("visual", EBufferType.UInt8).asBoolean()
        .build();
    static override index = UDPServerResponse.PLAYER_HIT;

    playerId: number = 0;
    attackerId: number = 0;
    visual: boolean = false;

}