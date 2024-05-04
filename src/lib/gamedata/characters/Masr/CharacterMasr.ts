import Character from "../../../components/abstract/Character";
import CharacterList from "../../CharacterList";
import KennBasicAttack from "../Kenn/KennBasicAttack";
import KennSignature1 from "../Kenn/KennSignature1";
import KennSignature2 from "../Kenn/KennSignature2";
import KennUltimate from "../Kenn/KennUltimate";
import {AbilitySet} from "../../../types/GameTypes";
import MasrBasicAttack from "./MasrBasicAttack";
import MasrSignature2 from "./MasrSignature2";
import MasrSignature1 from "./MasrSignature1";
import MasrUltimate from "./MasrUltimate";

export default class CharacterMasr extends Character {

    static override id = CharacterList.Masr;

    static override characterName = "Masr";

    static override maxHealth = 640;
    static override maxUltimateCharge = 1400;

    static override abilities: AbilitySet = [
        MasrBasicAttack,
        MasrSignature1,
        MasrSignature2,
        MasrUltimate
    ];

}