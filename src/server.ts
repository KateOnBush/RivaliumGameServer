import Logger from "./lib/tools/Logger";
import {LOGO} from "./lib/Macros";
import GameProcessor from "./lib/GameProcessor";
import PacketHandler from "./lib/PacketHandler";
import 'source-map-support/register'
import Database from "./lib/database/Database";
import TCPServer from "./lib/networking/tcp/TCPServer";
import UDPServer from "./lib/networking/udp/UDPServer";
import path from "path";

async function main() {


	Logger.clear();
	await PacketHandler.registerClasses(path.dirname(__filename) + "/lib/networking/tcp/request");
	await PacketHandler.registerClasses(path.dirname(__filename) + "/lib/networking/udp/request");
	Logger.clear();
	Logger.important(LOGO);
	TCPServer.start();
	UDPServer.start();
	GameProcessor.startUpdateLoop();
	GameProcessor.startPingLoop();
	Database.startLookupLoop();

}

main().catch(err => {
	Logger.clear();
	Logger.fatal("Couldn't start game server: {}", err);
	process.exit(1);
});

