import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import {UDPServerResponse} from "../../../enums/UDPPacketTypes";
import {PlayerID} from "../../../database/match/MatchTypes";
import EPlayerState from "../../../enums/EPlayerState";
import CharacterList from "../../../gamedata/CharacterList";
import {NumericBoolean, SignedNumericBoolean} from "../../../types/GameTypes";

export default class UResProjectileUpdate extends FormattedPacket {

    channel = EPacketChannel.UDP;
    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("projectileId", EBufferType.UInt16)
        .add("x", EBufferType.SInt32, 100)
        .add("y", EBufferType.SInt32, 100)
        .add("movX", EBufferType.SInt32, 100)
        .add("movY", EBufferType.SInt32, 100)
        .build();
    index: UDPServerResponse.ENTITY_UPDATE;

    projectileId: PlayerID;
    x: number;
    y: number;
    movX: number;
    movY: number;

}