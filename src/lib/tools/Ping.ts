import Player from "../components/Player";
import UReqPing from "../networking/udp/request/UReqPing";


export default class Ping {

	static ping(clients: Player[]) {

		let pingMessage = new UReqPing();

		clients.forEach(player=>{
			player.ping.lastSent = performance.now();
			player.send(pingMessage);
		})
	
	}

}