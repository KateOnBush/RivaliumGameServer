import Ability from "../components/abstract/Ability";
import Player from "../components/Player";

export type NumericBoolean = 0 | 1;
export type SignedNumericBoolean = -1 | 0 | 1;

export type AbilityInitializer = {new(player: Player): Ability};
export type AbilitySet = Array<AbilityInitializer>;

export type EffectData = {
    multiplier?: number;
}