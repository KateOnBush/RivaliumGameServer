import EBufferType from "../../../enums/EBufferType";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import EPlayerState from "../../../enums/EPlayerState";
import {NumericBoolean, SignedNumericBoolean} from "../../../types/GameTypes";
import {UDPServerRequest} from "../../../enums/UDPPacketTypes";
import Lag from "../../../tools/Lag";
import UDPIncomingPacket from "../UDPIncomingPacket";
import UDPPlayerSocket from "../UDPPlayerSocket";

export default class UReqPositionUpdate extends UDPIncomingPacket {

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
    static override index = UDPServerRequest.POSITION_UPDATE;

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

    handle(socket: UDPPlayerSocket) {

        if (!socket.identified || !socket.player) return;
        const sender = socket.player;

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