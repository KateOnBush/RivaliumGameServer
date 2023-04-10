import Vector2 from "../../tools/vector/Vector2";
import Game from "../Game";

export default abstract class GameElement {

    game?: Game = undefined;
    id: number;

    pos: Vector2 = new Vector2();

    get x() {
        return this.pos.x;
    }

    get y() {
        return this.pos.y;
    }

}
