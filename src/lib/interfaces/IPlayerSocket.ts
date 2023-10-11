import {WebSocket} from "ws";
import Game from "../components/Game";
import Player from "../components/Player";

export default interface IPlayerSocket extends WebSocket {

    player: Player;
    game: Game;
    identified: boolean;

}

