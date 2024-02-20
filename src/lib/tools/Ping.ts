import Player from "../components/Player";
import UResPing from "../networking/udp/response/UResPing";


export default class Ping {

	static ping(clients: Player[]) {

		let pingMessage = new UResPing();
		pingMessage.requesting = 1;

		clients.forEach(player=>{
			player.ping.lastSent = performance.now();
			player.send(pingMessage);
		})
	
	}

}