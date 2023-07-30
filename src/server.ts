import {WebSocketServer} from "ws"
import Logger from "./lib/tools/Logger";
import {dataSize, serverPort} from "./lib/Macros";
import PlayerSocket from "./lib/interfaces/IPlayerSocket";
import GMBuffer from "./lib/tools/GMBuffer";
import EBufferType from "./lib/enums/EBufferType";
import {EServerResponse} from "./lib/enums/EPacketTypes";
import GameProcessor from "./lib/GameProcessor";
import Ping from "./lib/tools/Ping";
import Game from "./lib/components/Game";
import PacketHandler from "./lib/PacketHandler";
import {EGameType} from "./lib/enums/EGameData";
import {LOGO} from "./logo";

import 'source-map-support/register'
import CharacterList from "./lib/gamedata/CharacterList";

let clients: PlayerSocket[] = [];

let game = new Game(EGameType.NORMAL);
let lastDelta = performance.now();

setInterval(() => {
	let dt = (performance.now() - lastDelta) * 60/1000;
	lastDelta = performance.now();
	GameProcessor.update(game)
	GameProcessor.process(game, dt);
}, 1000/60|0);


setInterval(()=>Ping.ping(clients), 500);

const wsServer = new WebSocketServer({
	port: serverPort
});


wsServer.on('listening', function(){

	console.log(LOGO);
	Logger.info("Server listening at port: {}", serverPort);

})

wsServer.on('connection', function(socket: PlayerSocket, req) {

	Logger.info("Client connected: {}", req.socket.remoteAddress);

	clients.push(socket);

	game.addPlayer(socket, CharacterList.Kenn);
	let player = socket.player!;

	/// Telling the client who he is
	let buff = GMBuffer.allocate(dataSize);
	buff.write(EServerResponse.PLAYER_JOIN, 	EBufferType.UInt8);
	buff.write(player.id, 						EBufferType.UInt16);
	buff.write(1, 								EBufferType.UInt8); //1: Connected, 0: Disconnected
	buff.write(0, 								EBufferType.UInt8); //0: Not you, 1: You
	buff.write(player.char.id, 					EBufferType.UInt8);
	buff.write(player.char.health, 				EBufferType.UInt16);
	buff.write(player.char.ultimateCharge, 		EBufferType.UInt16);
	buff.write(player.char.healthMax, 			EBufferType.UInt16);
	buff.write(player.char.ultimateChargeMax, 	EBufferType.UInt16);
	buff.write(70000, 							EBufferType.SInt32);
	buff.write(50000, 							EBufferType.SInt32);

	player.game?.broadcastExcept(buff, player);

	let selfBuff = GMBuffer.from(buff.getBuffer());
	selfBuff.poke(1, EBufferType.UInt8, 4);
	player.send(selfBuff);

	socket.on('message', function(data) {

		let buffer = data as Buffer;
		var n = ~~(buffer.byteLength/dataSize);
		for (let o = 0; o < n; o++) {

			PacketHandler.handle(GMBuffer.from(buffer.subarray(o * n, (o + 1) * dataSize - 1)), socket);

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