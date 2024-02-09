import Game from "../../components/Game";
import Player from "../../components/Player";

export default class UDPPlayerSocket {

    player: Player;
    game: Game;
    identified: boolean = false;
    address: string;
    port: number;

    get access() { return this.player.matchPlayer.access; }

    constructor(address: string, port: number) {
        this.address = address;
        this.port = port;
    }

}

