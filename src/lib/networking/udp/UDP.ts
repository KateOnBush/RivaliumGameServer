import UDPPlayerSocket from "./UDPPlayerSocket";
import {createSocket} from "dgram";

type UDPSocketAddress = string; //IP address + port

export default class UDP {

    private static socketMap = new Map<UDPSocketAddress, UDPPlayerSocket>();

    static getOrCreateSocket(address: string, port: number): UDPPlayerSocket {
        let getSocket = this.socketMap.get(address + port);
        if (!getSocket) return this.createSocket(address, port);
        return getSocket;
    }

    static createSocket(address: string, port: number): UDPPlayerSocket {
        let socket = new UDPPlayerSocket(address, port);
        this.socketMap.set(address + port, socket);
        return socket;
    }

}