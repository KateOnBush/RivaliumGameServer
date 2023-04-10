import { dataSize } from "../../constants";
import { RESPONSE } from "../enums/EPacketTypes";
import IPlayerSocket from "../interfaces/IPlayerSocket";


export default class Ping {

	static ping(clients: IPlayerSocket[]) {

		clients.forEach(c=>{

			c.sentPing = performance.now();
	
			let b = Buffer.alloc(dataSize);
	
			b.writeUInt8(RESPONSE.PING, 0);
			b.writeUInt8(0, 1);
	
			c.send(b);
	
		})
	}

}