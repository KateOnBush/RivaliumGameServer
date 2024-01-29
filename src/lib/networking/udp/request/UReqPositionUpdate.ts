import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import {TCPServerRequest} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import EPlayerState from "../../../enums/EPlayerState";
import {NumericBoolean, SignedNumericBoolean} from "../../../types/GameTypes";
import {UDPServerRequest} from "../../../enums/UDPPacketTypes";
import IncomingPacket from "../../../interfaces/IncomingPacket";
import Player from "../../../components/Player";
import Lag from "../../../tools/Lag";

export default class UReqPositionUpdate extends FormattedPacket implements IncomingPacket {

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
        .add("orientation", EBufferType.UInt8).asBoolean()
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
    orientation: SignedNumericBoolean;

    handle(sender: Player) {

        sender.pos.x = this.x;
        sender.pos.y = this.y;
        sender.mov.x = this.movX;
        sender.mov.y = this.movY;
        sender.state.id = this.stateId;
        sender.state.onGround = this.onGround;
        sender.state.slide = this.slide;
        sender.state.orientation = this.orientation == 1 ? 1 : -1;
        sender.mouse.x = this.mouseX;
        sender.mouse.y = this.mouseY;

        let pred = Lag.predictNextPosition(sender);
        sender.pos.x = pred.pos.x;
        sender.mov.x = pred.mov.x;
        if (!sender.state.onGround){
            sender.pos.y = pred.pos.y;
            sender.mov.y = pred.mov.y;
        }

    }

}