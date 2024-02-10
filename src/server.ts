import {WebSocketServer} from "ws"
import Logger from "./lib/tools/Logger";
import {LOGO, serverPort} from "./lib/Macros";
import PlayerSocket from "./lib/networking/tcp/TCPPlayerSocket";
import GMBuffer from "./lib/tools/GMBuffer";
import GameProcessor from "./lib/GameProcessor";
import Ping from "./lib/tools/Ping";
import PacketHandler from "./lib/PacketHandler";

import 'source-map-support/register'
import Database from "./lib/database/Database";
import dgram from 'dgram';
import UDP from "./lib/networking/udp/UDP";
import TCPServer from "./lib/networking/tcp/TCPServer";
import UDPServer from "./lib/networking/udp/UDPServer";
import path from "path";

let lastDelta = performance.now();

async function main() {

	await PacketHandler.registerClasses(path.dirname(__filename) + "/lib/networking/tcp/request");
	await PacketHandler.registerClasses(path.dirname(__filename) + "/lib/networking/udp/request");
	Logger.important(LOGO);
	TCPServer.start();
	UDPServer.start();

}

main().catch(err => {
	Logger.clear();
	Logger.fatal("Couldn't start game server: {}", err);
	process.exit(1);
});


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



