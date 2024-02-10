import EBufferType from "../../../enums/EBufferType";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import {UDPServerResponse} from "../../../enums/UDPPacketTypes";
import {PlayerID} from "../../../database/match/MatchTypes";
import UDPPacket from "../UDPPacket";

export default class UResPlayerGrapple extends UDPPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("playerId", EBufferType.UInt16)
        .add("x", EBufferType.SInt32, 100)
        .add("y", EBufferType.SInt32, 100)
        .add("grappled", EBufferType.UInt8)
        .build();
    static override index = UDPServerResponse.PLAYER_GRAPPLE;

    playerId: PlayerID;
    x: number;
    y: number;
    grappled: number;

}