import {dataSize} from "../Macros";
import {EServerResponse} from "../enums/EPacketTypes";
import IPlayerSocket from "../interfaces/IPlayerSocket";
import GMBuffer from "./GMBuffer";
import EBufferType from "../enums/EBufferType";


export default class Ping {

	static ping(clients: IPlayerSocket[]) {

		let b = GMBuffer.allocate(dataSize);
		b.write(EServerResponse.PING, EBufferType.UInt8);
		b.write(0, EBufferType.UInt8);

		clients.forEach(c=>{
			if (!c.player) return;
			c.player.ping.lastSent = performance.now();
			c.player.send(b);
		})
	
	}

}