import {WebSocketServer} from "ws"
import Logger from "./lib/tools/Logger";
import {dataSize, LOGO, serverPort} from "./lib/Macros";
import PlayerSocket from "./lib/networking/tcp/TCPPlayerSocket";
import GMBuffer from "./lib/tools/GMBuffer";
import GameProcessor from "./lib/GameProcessor";
import Ping from "./lib/tools/Ping";
import PacketHandler from "./lib/PacketHandler";

import 'source-map-support/register'
import Database from "./lib/database/Database";
import dgram from 'dgram';
import UDP from "./lib/networking/udp/UDP";

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
	GameProcessor.GameList.forEach(game => Ping.ping(game.players));
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

udpServer.on("message", (msg, remoteInfo) => {

	let buffer = GMBuffer.from(msg);
	PacketHandler.handleUDP(buffer, UDP.getOrCreateSocket(remoteInfo.address, remoteInfo.port));

})

udpServer.bind(serverPort);