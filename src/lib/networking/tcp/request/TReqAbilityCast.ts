import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import {TCPServerRequest} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import TResPlayerAbilityCast from "../response/TResPlayerAbilityCast";
import TCPIncomingPacket from "../TCPIncomingPacket";
import TCPPlayerSocket from "../TCPPlayerSocket";

export default class TReqAbilityCast extends TCPIncomingPacket {

    static override channel = EPacketChannel.TCP;
    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("ability", EBufferType.UInt8)
        .add("abilityN", EBufferType.UInt8)
        .build();
    static override index = TCPServerRequest.ABILITY_CAST;

    ability: number = 0;
    abilityN: number = 0;

    handle(socket: TCPPlayerSocket) {

        if(!socket.identified || !socket.player) return;
        const sender = socket.player;

        if (sender.char.abilities[this.ability].cast(this.abilityN, sender)) {

            let casted = new TResPlayerAbilityCast();
            casted.id = sender.id;
            casted.ability = this.ability;
            casted.abilityN = this.abilityN;
            sender.game.broadcast(casted);

        }

    }

}