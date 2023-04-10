import { NumericBoolean, SignedNumericBoolean } from "../../types/GameTypes";

export default class PlayerState {

    on_ground: NumericBoolean;
    jump_prep: number;
    wall_slide: NumericBoolean;
    grappling: NumericBoolean;
    grappled: NumericBoolean;
    dir: SignedNumericBoolean;
    dash: NumericBoolean;
    slide: NumericBoolean;
    grounded: NumericBoolean;
    slope: NumericBoolean;
    dead: NumericBoolean;

}