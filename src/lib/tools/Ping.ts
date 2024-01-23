import {dataSize} from "../Macros";
import {TCPServerResponse} from "../enums/TCPPacketTypes";
import TCPPlayerSocket from "../networking/TCPPlayerSocket";
import GMBuffer from "./GMBuffer";
import EBufferType from "../enums/EBufferType";


export default class Ping {

	static ping(clients: TCPPlayerSocket[]) {

		let b = GMBuffer.allocate(dataSize);
		b.write(TCPServerResponse.PING, EBufferType.UInt8);
		b.write(0, EBufferType.UInt8);

		clients.forEach(c=>{
			if (!c.player) return;
			c.player.ping.lastSent = performance.now();
			c.player.send(b);
		})
	
	}

}