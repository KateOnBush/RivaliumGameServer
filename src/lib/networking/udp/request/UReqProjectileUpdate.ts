import EBufferType from "../../../enums/EBufferType";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import {UDPServerRequest} from "../../../enums/UDPPacketTypes";
import Lag from "../../../tools/Lag";
import Vector2 from "../../../tools/vector/Vector2";
import UDPIncomingPacket from "../UDPIncomingPacket";
import UDPPlayerSocket from "../UDPPlayerSocket";

export default class UReqProjectileUpdate extends UDPIncomingPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("projId", EBufferType.UInt16)
        .add("x", EBufferType.SInt32, 100)
        .add("y", EBufferType.SInt32, 100)
        .add("movX", EBufferType.SInt32, 100)
        .add("movY", EBufferType.SInt32, 100)
        .build();
    static override index = UDPServerRequest.PROJECTILE_UPDATE;

    collidedEntity: number;
    projId: number;
    x: number;
    y: number;
    movX: number;
    movY: number;

    handle(socket: UDPPlayerSocket) {
        if (!socket.identified || !socket.player) return;
        const sender = socket.player;

        let proj = sender.game.getProjectile(this.projId);

        if (!proj) return;
        if (proj.owner.id != sender.id) return;

        let comp1 = Lag.compensatePrecise(sender.ping.ms);

        let prediction = Lag.predictPosition(
            Vector2.cartesian(this.x, this.y),
            Vector2.cartesian(this.movX, this.movY),
            proj.bounce ? comp1 : 0);

        proj.mov = prediction.mov;
        proj.pos = prediction.pos;

        if (proj.cancelled) return;

        if (proj.dieOnCol){
            proj.destroy();
            return;
        } else if (proj.bounce) {
            proj.bounceCount++;
            proj.onBounce();
        } else proj.collided = true;

        proj.update();

    }

}