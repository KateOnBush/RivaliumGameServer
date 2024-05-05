import EBufferType from "../../../enums/EBufferType";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import EPlayerState from "../../../enums/EPlayerState";
import {NumericBoolean, SignedNumericBoolean} from "../../../types/GameTypes";
import {UDPServerRequest} from "../../../enums/UDPPacketTypes";
import Lag from "../../../tools/Lag";
import UDPIncomingPacket from "../UDPIncomingPacket";
import UDPPlayerSocket from "../UDPPlayerSocket";
import UResPlayerUpdate from "../response/UResPlayerUpdate";

export default class UReqPositionUpdate extends UDPIncomingPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("counter", EBufferType.UInt32)
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

    counter: number;

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

        if (this.counter < sender.receivingCounter) return;
        sender.receivingCounter = this.counter;

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

        let pred = Lag.predictNextPosition(sender, sender.state.onGround == 0);
        sender.pos.x = pred.pos.x;
        sender.mov.x = pred.mov.x;
        sender.pos.y = pred.pos.y;
        sender.mov.y = pred.mov.y;

        sender.game.players.forEach(recipient => {

            let playerUpdate = new UResPlayerUpdate();

            let comp = Lag.compensateClose(recipient.ping.ms);
            if (sender.speed < 1) comp = 0;

            let pred = Lag.predictPosition(sender.pos, sender.mov, comp, sender.state.onGround == 0);

            playerUpdate.counter = sender.sendingCounter;
            sender.sendingCounter++;
            if (sender.sendingCounter == 0xFFFFFFFF) sender.sendingCounter = 0;
            playerUpdate.playerId = sender.id;
            playerUpdate.stateId = sender.state.id;
            playerUpdate.x = pred.pos.x;
            playerUpdate.y = pred.pos.y;
            playerUpdate.movX = pred.mov.x;
            playerUpdate.movY = pred.mov.y;
            playerUpdate.onGround = sender.state.onGround;
            playerUpdate.direction = sender.state.orientation == 1 ? 1 : 0;
            playerUpdate.slide = sender.state.slide;
            playerUpdate.gemHolder = sender.gemHolder;
            playerUpdate.characterId = sender.character.id;
            playerUpdate.health = sender.health;
            playerUpdate.ultimateCharge = sender.ultimateCharge;
            playerUpdate.maxHealth = sender.maxHealth;
            playerUpdate.maxUltimateCharge = sender.maxUltimateCharge;
            playerUpdate.mouseX = sender.mouse.x;
            playerUpdate.mouseY = sender.mouse.y;
            playerUpdate.movementBoost = sender.boost;
            playerUpdate.ping = sender.ping.ms;
            playerUpdate.lethalityAndResistance = sender.lethality + sender.resistance * 11;
            playerUpdate.haste = sender.haste;
            recipient.send(playerUpdate);

        })

    }

}