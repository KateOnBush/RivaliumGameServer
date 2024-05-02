import EBufferType from "../../../enums/EBufferType";
import {TCPServerResponse} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import UDPPacket from "../UDPPacket";
import {UDPServerResponse} from "../../../enums/UDPPacketTypes";

export default class UResPlayerHeal extends UDPPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("playerId", EBufferType.UInt16)
        .build();
    static override index = UDPServerResponse.PLAYER_HEAL;

    playerId: number = 0;

}