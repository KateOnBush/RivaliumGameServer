import EPlayerState from "../../enums/EPlayerState";
import {NumericBoolean, SignedNumericBoolean} from "../../types/GameTypes";

export default class PlayerState {

    id: EPlayerState = EPlayerState.FREE;

    onGround: NumericBoolean;
    orientation: SignedNumericBoolean;
    slide: NumericBoolean;
    dead: NumericBoolean;

}