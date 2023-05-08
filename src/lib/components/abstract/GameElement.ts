import Vector2 from "../../tools/vector/Vector2";
import Game from "../Game";

export default abstract class GameElement {

    game?: Game = undefined;
    id: number;

    [key: string]: any;

    pos: Vector2 = new Vector2();

    stepMethods: ((t: this, dt: number) => void)[] = [];

    step(method: (t: this, dt: number) => void): this{
        this.stepMethods.push(method);
        return this;
    }

    process(dt: number){
        for(const m of this.stepMethods){
            m(this, dt);
        }
    }

    get x() {
        return this.pos.x;
    }

    get y() {
        return this.pos.y;
    }

}
