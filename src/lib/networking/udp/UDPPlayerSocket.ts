import Game from "../../components/Game";
import Player from "../../components/Player";
import UDPServer from "./UDPServer";

export default class UDPPlayerSocket {

    player: Player;
    game: Game;
    identified: boolean = false;
    address: string;
    port: number;

    get access() { return this.player.matchPlayer.access; }

    send(message: Buffer) {
        if (this.address != "") UDPServer.sendRaw(message, this.address, this.port);
    }

    constructor(address: string, port: number) {
        this.address = address;
        this.port = port;
    }

}

