import Game from "../components/Game";
import Player from "../components/Player";

export default class UDPPlayerSocket {

    player: Player;
    game: Game;
    identified: boolean = false;
    address: string;
    port: number;

    get access() { return this.player.matchPlayer.access; }

    constructor(player: Player, game: Game, address: string, port: number) {
        this.player = player;
        this.game = game;
        this.address = address;
        this.port = port;
    }

}

