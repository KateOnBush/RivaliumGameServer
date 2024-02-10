import EBufferType from "../../../enums/EBufferType";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import {UDPServerRequest} from "../../../enums/UDPPacketTypes";
import UDPIncomingPacket from "../UDPIncomingPacket";
import UDPPlayerSocket from "../UDPPlayerSocket";

export default class UReqEntityUpdate extends UDPIncomingPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("entityId", EBufferType.UInt16)
        .add("x", EBufferType.SInt32, 100)
        .add("y", EBufferType.SInt32, 100)
        .add("movX", EBufferType.SInt32, 100)
        .add("movY", EBufferType.SInt32, 100)
        .add("param1", EBufferType.SInt32, 100)
        .add("param2", EBufferType.SInt32, 100)
        .add("param3", EBufferType.SInt32, 100)
        .add("param4", EBufferType.SInt32, 100)
        .add("param5", EBufferType.SInt32, 100)
        .build();
    static override index = UDPServerRequest.ENTITY_UPDATE;

    entityId: number;
    x: number;
    y: number;
    movX: number;
    movY: number;
    param1: number;
    param2: number;
    param3: number;
    param4: number;
    param5: number;

    handle(socket: UDPPlayerSocket) {

        if (!socket.identified || !socket.player) return;
        const sender = socket.player;

        let getEntity = sender.game.getEntity(this.entityId);

        if (!getEntity) return;

        getEntity.pos.set(this.x, this.y);
        getEntity.mov.set(this.movX, this.movY);
        getEntity.parameters[0] = this.param1;
        getEntity.parameters[1] = this.param2;
        getEntity.parameters[2] = this.param3;
        getEntity.parameters[3] = this.param4;
        getEntity.parameters[4] = this.param5;
        getEntity.update();
    }

}