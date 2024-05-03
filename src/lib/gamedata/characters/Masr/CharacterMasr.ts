import Character from "../../../components/abstract/Character";
import CharacterList from "../../CharacterList";
import KennBasicAttack from "../Kenn/KennBasicAttack";
import KennSignature1 from "../Kenn/KennSignature1";
import KennSignature2 from "../Kenn/KennSignature2";
import KennUltimate from "../Kenn/KennUltimate";
import {AbilitySet} from "../../../types/GameTypes";

export default class CharacterMasr extends Character {

    static override id = CharacterList.Masr;

    static override characterName = "Masr";

    static override maxHealth = 640;
    static override maxUltimateCharge = 1400;

    static override abilities: AbilitySet = [
        KennBasicAttack,
        KennSignature1,
        KennSignature2,
        KennUltimate
    ];

}