import Vector2 from "../../tools/vector/Vector2";
import Game from "../Game";

export default abstract class GameElement {

    game: Game;
    id: number;

    [key: string]: any;

    pos: Vector2 = new Vector2();

    step(dt: number){}

    process(dt: number){
        this.step(dt);
    }

    get x() {
        return this.pos.x;
    }

    get y() {
        return this.pos.y;
    }

}
