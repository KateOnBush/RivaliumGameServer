import dgram from "dgram";
import Logger from "../../tools/Logger";
import {serverPort} from "../../Macros";
import GMBuffer from "../../tools/GMBuffer";
import PacketHandler from "../../PacketHandler";
import UDP from "./UDP";

export default class UDPServer {

    static server: dgram.Socket;

    static start() {

        this.server = dgram.createSocket('udp6');

        this.server.on('listening', function () {
            Logger.info("UDP Channel listening at port: {}", serverPort);
        })


        this.server.on("message", (msg, remoteInfo) => {

            let buffer = GMBuffer.from(msg);
            Logger.info("Message received [{}]", buffer.size());
            PacketHandler.handleUDP(buffer, UDP.getOrCreateSocket(remoteInfo.address, remoteInfo.port));

        })

        this.server.bind(serverPort);

    }

    static sendRaw(message: Buffer, address: string, port: number) {
        this.server.send(message, port, address);
    }

}