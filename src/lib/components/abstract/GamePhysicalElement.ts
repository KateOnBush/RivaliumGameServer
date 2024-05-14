import {gravityVec} from '../../Macros';
import Vector2 from '../../tools/vector/Vector2';
import GameElement from "./GameElement";

export default abstract class GamePhysicalElement extends GameElement {

    applyGravity: boolean = true;
    mov: Vector2 = new Vector2();

    get direction() {
        return this.mov.direction();
    }

    get speed() {
        return this.mov.magnitude();
    }

    get mx() {
        return this.mov.x;
    }

    get my() {
        return this.mov.y;
    }

    move(dt: number){

        if (this.applyGravity) this.mov.add(Vector2.multiply(gravityVec, dt));
        this.pos.add(this.mov);

    }

} 