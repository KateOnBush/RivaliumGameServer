import {WebSocketServer} from "ws"
import Logger from "./lib/tools/Logger";
import {dataSize, LOGO, serverPort} from "./lib/Macros";
import PlayerSocket from "./lib/interfaces/IPlayerSocket";
import GMBuffer from "./lib/tools/GMBuffer";
import GameProcessor from "./lib/GameProcessor";
import Ping from "./lib/tools/Ping";
import PacketHandler from "./lib/PacketHandler";

import 'source-map-support/register'
import Database from "./lib/database/Database";
import dgram from 'dgram';
import {FormattedPacket} from "./lib/networking/FormattedPacket";
import FormattedPacketAttributeListBuilder from "./lib/networking/attributes/FormattedPacketAttributeListBuilder";
import EPacketChannel from "./lib/enums/EPacketChannel";
import EBufferType from "./lib/enums/EBufferType";

let lastDelta = performance.now();

setInterval(() => {
	for(const game of GameProcessor.GameList) {
		let dt = (performance.now() - lastDelta) * 60 / 1000;
		lastDelta = performance.now();
		GameProcessor.process(game, dt);
		GameProcessor.update(game)
	}
}, 1000/60|0);


setInterval(()=>{
	GameProcessor.GameList.forEach(game => Ping.ping(game.players.map(player => player.TCPsocket)));
}, 1000);
setInterval(()=>Database.lookupUninitializedMatches(), 5000);

const wsServer = new WebSocketServer({
	port: serverPort
});
const udpServer = dgram.createSocket('udp6');


wsServer.on('listening', function(){

	Logger.important(LOGO);
	Logger.info("Server listening at port: {}", serverPort);

})

udpServer.on('listening', function () {
	Logger.info("UDP Channel listening at port: {}", serverPort);
})

wsServer.on('connection', function(socket: PlayerSocket, req) {

	Logger.info("Client connected: {}", req.socket.remoteAddress);

	socket.identified = false;

	setTimeout(()=> {
		if (!socket.identified) {
			socket.close();
		}
	}, 5000);

	socket.on('message', function(data) {

		let buffer = data as Buffer;
		let n = ~~(buffer.byteLength/dataSize);
		for (let o = 0; o < n; o++) {

			PacketHandler.handle(GMBuffer.from(buffer.subarray(o * n, (o + 1) * dataSize - 1)), socket).catch((err) => {
				Logger.error("Error handling received packet from {}\nError: {}", req.socket.remoteAddress, (err as Error).stack);
			});

		}

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

udpServer.bind(serverPort);