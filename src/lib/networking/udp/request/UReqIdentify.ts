import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import {UDPServerRequest} from "../../../enums/UDPPacketTypes";
import UDPPlayerSocket from "../UDPPlayerSocket";
import UDPIncomingPacket from "../UDPIncomingPacket";
import Player from "../../../components/Player";
import TResPreMatch from "../../tcp/response/TResPreMatch";
import {EPreMatchState} from "../../../enums/EPreMatchState";
import Logger from "../../../tools/Logger";
import {MatchState} from "../../../database/match/MatchTypes";
import Time from "../../../tools/Time";
import Database from "../../../database/Database";

export default class UReqIdentify extends UDPIncomingPacket{

    static override channel = EPacketChannel.UDP;
    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("identifier", EBufferType.UInt32)
        .build();
    static override index = UDPServerRequest.IDENTIFY;

    static identifierMap = new Map<number, Player>();

    identifier: number;

    handle(socket: UDPPlayerSocket) {

        let player = UReqIdentify.identifierMap.get(this.identifier);
        if (!player) return Logger.warn("Bad UDP identification request");

        socket.player = player;
        socket.game = player.game;
        player.UDPsocket = socket;
        player.UDPsocket.identified = true;
        player.TCPsocket.identified = true;

        let msg = new TResPreMatch();
        msg.playerId = player.id;
        msg.state = EPreMatchState.PLAYER_LOADED;

        Logger.success("UDP-identified!");

        player.game.broadcast(msg);

    }



}