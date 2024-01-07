import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import {TCPServerRequest} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import EPlayerState from "../../../enums/EPlayerState";
import {NumericBoolean, SignedNumericBoolean} from "../../../types/GameTypes";
import {UDPServerRequest} from "../../../enums/UDPPacketTypes";

export default class UReqPositionUpdate extends FormattedPacket {

    channel = EPacketChannel.UDP;
    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("x", EBufferType.SInt32, 100)
        .add("y", EBufferType.SInt32, 100)
        .add("movX", EBufferType.SInt32, 100)
        .add("movY", EBufferType.SInt32, 100)
        .add("mouseX", EBufferType.SInt32, 100)
        .add("mouseY", EBufferType.SInt32, 100)
        .add("stateId", EBufferType.UInt8)
        .add("onGround", EBufferType.UInt8).asBoolean()
        .add("slide", EBufferType.UInt8).asBoolean()
        .add("direction", EBufferType.UInt8)
        .build();
    index: UDPServerRequest.POSITION_UPDATE;

    x: number;
    y: number;
    movX: number;
    movY: number;
    mouseX: number;
    mouseY: number;

    stateId: EPlayerState;

    onGround: NumericBoolean;
    slide: NumericBoolean;
    direction: SignedNumericBoolean;

}