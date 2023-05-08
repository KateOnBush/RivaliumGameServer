import Ability from "../components/Ability";

export type NumericBoolean = 0 | 1;
export type SignedNumericBoolean = -1 | 0 | 1;

export type AbilitySet = [Ability, Ability, Ability, Ability];
export type AbilitySetInitializer = () => AbilitySet;

export type EffectData = {
    multiplier?: number;
}