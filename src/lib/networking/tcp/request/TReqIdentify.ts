import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import {TCPServerRequest} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import IncomingPacket from "../../../interfaces/IncomingPacket";
import Player from "../../../components/Player";
import Logger from "../../../tools/Logger";
import Database from "../../../database/Database";
import {MatchState} from "../../../database/match/MatchTypes";
import Time from "../../../tools/Time";
import TResPreMatch from "../response/TResPreMatch";
import {EPreMatchState} from "../../../enums/EPreMatchState";

export default class TReqIdentify extends FormattedPacket implements IncomingPacket {

    channel = EPacketChannel.TCP;
    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("pass", EBufferType.UInt16)
        .add("access", EBufferType.UInt16)
        .build();
    index: TCPServerRequest.IDENTIFY;

    pass: number;
    access: number;

    async handle(sender: Player): Promise<void> {

        let pass = this.pass;
        let access = this.access;

        let response = new TResPreMatch();

        Logger.info("Player attempting identification, verifying...");

        let match = await Database.verifyPlayer(sender.TCPsocket, pass, access);
        if (!match) {
            response.write(EPreMatchState.MATCH_NOT_FOUND, EBufferType.UInt8);
        } else if (match.state == MatchState.FINISHED) {
            response.write(EPreMatchState.MATCH_ENDED, EBufferType.UInt8);
        } else if (match.state == MatchState.STARTED || match.state == MatchState.LOADING) {
            response.write(EPreMatchState.REJOINED, EBufferType.UInt8);
            sender.TCPsocket.identified = true;
            sender.UDPSocket.identified = false;
        } else {

            Logger.info("Player identified! Match id: {}", match.getID());
            sender.TCPsocket.identified = true;
            sender.UDPSocket.identified = false;
            response.write(EPreMatchState.IDENTIFIED, EBufferType.UInt8);

            let msg = new TResPreMatch();
            msg.playerId = sender.matchPlayer.playerId;
            msg.state = EPreMatchState.PLAYER_LOADED;

            sender.game.broadcast(msg);

            Logger.info("Sending IDENTIFIED");

        }

        sender.send(response)

        if (!match) return;

        if (match.playerManager.players.every(team => team.every(mPlayer => mPlayer.joined)) && match.state == MatchState.AWAITING_PLAYERS) {

            //start match
            match.state = MatchState.LOADING;
            Logger.info("All players joined, starting...");

            let msg = new TResPreMatch();
            msg.state = EPreMatchState.MATCH_STARTING;
            sender.game.broadcast(msg);

            await Time.wait(10000);

            msg.state = EPreMatchState.MATCH_STARTED;
            match.state = MatchState.STARTED;

            await Database.saveMatch(match);

            sender.game.broadcast(msg);
            match.game.start();

        }
    }

}