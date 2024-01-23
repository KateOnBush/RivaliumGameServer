import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import {TCPServerRequest, TCPServerResponse} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import IncomingPacket from "../../../interfaces/IncomingPacket";
import Player from "../../../components/Player";
import GMBuffer from "../../../tools/GMBuffer";
import {dataSize} from "../../../Macros";
import Logger from "../../../tools/Logger";
import Database from "../../../database/Database";
import {MatchState} from "../../../database/match/MatchTypes";
import Time from "../../../tools/Time";

export default class TReqIdentify extends FormattedPacket implements IncomingPacket {

    channel = EPacketChannel.TCP;
    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("pass", EBufferType.UInt16)
        .add("access", EBufferType.UInt16)
        .build();
    index: TCPServerRequest.IDENTIFY;

    pass: number;
    access: number;

    handle(sender: Player): void {

        let pass = this.pass;
        let access = this.access;

        let response = GMBuffer.allocate(dataSize);
        response.write(TCPServerResponse.PRE_MATCH, EBufferType.UInt8);

        Logger.info("Player attempting identification, verifying...");

        let match = await Database.verifyPlayer(sender.TCPsocket, pass, access);
        if (!match) {
            response.write(EPrematchState.MATCH_NOT_FOUND, EBufferType.UInt8);
        } else if (match.state == MatchState.FINISHED) {
            response.write(EPrematchState.MATCH_ENDED, EBufferType.UInt8);
        } else if (match.state == MatchState.STARTED || match.state == MatchState.LOADING) {
            response.write(EPrematchState.REJOINED, EBufferType.UInt8);
            socket.identified = true;
            //rejoining
        } else {

            Logger.info("Player identified! Match id: {}", match.getID());
            socket.identified = true;
            response.write(EPrematchState.IDENTIFIED, EBufferType.UInt8);

            let msg = GMBuffer.allocate(dataSize);
            msg.write(TCPServerResponse.PRE_MATCH, EBufferType.UInt8);
            msg.write(EPrematchState.PLAYER_LOADED, EBufferType.UInt8);
            msg.write(socket.player.matchPlayer.playerId, EBufferType.UInt16);

            socket.game.broadcast(msg);

            Logger.info("Sending IDENTIFIED");

        }

        socket.send(response.getBuffer());

        if (!match) break;

        if (match.playerManager.players.every(team => team.every(mPlayer => mPlayer.joined)) && match.state == MatchState.AWAITING_PLAYERS) {

            //start match
            match.state = MatchState.LOADING;
            Logger.info("All players joined, starting...");

            let msg = GMBuffer.allocate(dataSize);
            msg.write(TCPServerResponse.PREMATCH, EBufferType.UInt8);
            msg.write(EPrematchState.MATCH_STARTING, EBufferType.UInt8);
            socket.game.broadcast(msg);

            await Time.wait(10000);

            msg = GMBuffer.allocate(dataSize);
            msg.write(TCPServerResponse.PREMATCH, EBufferType.UInt8);
            msg.write(EPrematchState.MATCH_STARTED, EBufferType.UInt8);

            match.state = MatchState.STARTED;

            await Database.saveMatch(match);

            socket.game.broadcast(msg);

            match.game.start();

        }
    }

}