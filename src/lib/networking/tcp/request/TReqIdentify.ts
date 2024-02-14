import EBufferType from "../../../enums/EBufferType";
import {TCPServerRequest} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import Logger from "../../../tools/Logger";
import Database from "../../../database/Database";
import {MatchState} from "../../../database/match/MatchTypes";
import Time from "../../../tools/Time";
import TResPreMatch from "../response/TResPreMatch";
import {EPreMatchState} from "../../../enums/EPreMatchState";
import TCPIncomingPacket from "../TCPIncomingPacket";
import TCPPlayerSocket from "../TCPPlayerSocket";
import UReqIdentify from "../../udp/request/UReqIdentify";
import TResUDPChannel from "../response/TResUDPChannel";

export default class TReqIdentify extends TCPIncomingPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("pass", EBufferType.UInt32)
        .add("access", EBufferType.UInt32)
        .build();
    static override index = TCPServerRequest.IDENTIFY;

    pass: number;
    access: number;

    async handle(socket: TCPPlayerSocket): Promise<void> {

        let pass = this.pass;
        let access = this.access;

        let response = new TResPreMatch();

        Logger.info("Player attempting identification {} {}, verifying...", pass, access);

        let match = await Database.verifyPlayer(socket, pass, access);
        const sender = socket.player;
        if (!match) {
            response.state = EPreMatchState.MATCH_NOT_FOUND;
            Logger.info("Match not found!");
            socket.send(response.bake().getBuffer());
            return;
        }

        if (match.state == MatchState.FINISHED) {
            response.state = EPreMatchState.MATCH_ENDED;
        } else if (match.state == MatchState.STARTED || match.state == MatchState.LOADING) {
            response.state = EPreMatchState.REJOINED;
            sender.TCPsocket.identified = true;
            sender.UDPsocket.identified = false;
        } else {

            Logger.info("Player identified! Match id: {}", match.getID());
            sender.TCPsocket.identified = true;
            sender.UDPsocket.identified = false;
            response.state = EPreMatchState.IDENTIFIED;

            let identifier = Math.floor(Math.random() * 0xFFFFFFFF);
            UReqIdentify.identifierMap.set(identifier, sender);

            let udpChannelIdentify = new TResUDPChannel();
            udpChannelIdentify.identifier = identifier;
            sender.send(udpChannelIdentify);

            Logger.info("Awaiting UDP identification...");

        }

        sender.send(response)

        //If all players joined
        if (match.playerManager.players.every(team => team.every(mPlayer => mPlayer.joined)) && match.state == MatchState.AWAITING_PLAYERS) {

            //Wait for all to be properly identified
            let attempts = 10;
            while(attempts >= 0) {
                if (match.game.players.every(player => (player.TCPsocket && player.UDPsocket && player.TCPsocket.identified && player.UDPsocket.identified))) {
                    break;
                } else if (attempts == 0) {
                    //Match failed to start
                    let failMessage = new TResPreMatch();
                    failMessage.state = EPreMatchState.MATCH_CANCELLED;
                    sender.game.broadcast(failMessage);
                    //sender.game.cancel();
                    return;
                }
                await Time.wait(2000);
                attempts--;
            }

            match.state = MatchState.LOADING;
            Logger.info("All players joined, starting...");

            let msg = new TResPreMatch();
            msg.state = EPreMatchState.MATCH_STARTING;
            sender.game.broadcast(msg);

            await Time.wait(5000);

            msg.state = EPreMatchState.MATCH_STARTED;
            match.state = MatchState.STARTED;

            await Database.saveMatch(match);

            sender.game.broadcast(msg);
            match.game.start();

        }

    }

}