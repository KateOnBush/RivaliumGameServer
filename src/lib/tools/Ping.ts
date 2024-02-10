import Player from "../components/Player";
import UReqPing from "../networking/udp/request/UReqPing";


export default class Ping {

	static ping(clients: Player[]) {

		let pingMessage = new UReqPing();

		clients.forEach(c=>{
			if (!c.player) return;
			c.player.ping.lastSent = performance.now();
			c.player.send(pingMessage);
		})
	
	}

}