import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import {UDPServerResponse} from "../../../enums/UDPPacketTypes";
import {PlayerID} from "../../../database/match/MatchTypes";
import UDPPacket from "../UDPPacket";

export default class UResPlayerFlip extends UDPPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("playerId", EBufferType.UInt16)
        .add("forward", EBufferType.UInt8)
        .add("start", EBufferType.UInt8, 100)
        .build();
    static override index = UDPServerResponse.PLAYER_FLIP;

    playerId: PlayerID;
    forward: number;
    start: number;

}