import {WebSocketServer} from "ws";
import {serverPort} from "../../Macros";
import Logger from "../../tools/Logger";
import PlayerSocket from "./TCPPlayerSocket";
import GMBuffer from "../../tools/GMBuffer";
import PacketHandler from "../../PacketHandler";

export default class TCPServer {

    static server: WebSocketServer;

    static start() {

        this.server = new WebSocketServer({
            port: serverPort
        });

        this.server.on('listening', function(){

            Logger.info("Server listening at port: {}", serverPort);

        })

        this.server.on('connection', function(socket: PlayerSocket, req) {

            Logger.info("Client connected: {}", req.socket.remoteAddress);

            socket.identified = false;

            setTimeout(()=> {
                if (!socket.identified) {
                    socket.close();
                }
            }, 5000);

            socket.on('message', function(data) {

                let buffer = GMBuffer.from(data as Buffer);
                PacketHandler.handleTCP(buffer, socket);

            });

            socket.on('close', function() {
                Logger.info("Closing connection with client: {}", req.socket.remoteAddress);
                if (!socket.game || !socket.player) return;
                socket.game.removePlayer(socket.player.id);
            });

            socket.on('error', function() {
                Logger.error("Connection interrupted with client: {}", req.socket.remoteAddress);
                if (!socket.game || !socket.player) return;
                socket.game.removePlayer(socket.player.id);
            });

        });

    }

}