import EPlayerState from "../../enums/EPlayerState";
import {NumericBoolean, SignedNumericBoolean} from "../../types/GameTypes";

export default class PlayerState {

    id: EPlayerState = EPlayerState.FREE;

    on_ground: NumericBoolean;
    dir: SignedNumericBoolean;
    slide: NumericBoolean;
    dead: NumericBoolean;

}