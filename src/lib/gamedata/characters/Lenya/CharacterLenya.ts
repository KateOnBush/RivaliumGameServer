import Character from "../../../components/abstract/Character";
import CharacterList from "../../CharacterList";
import {AbilitySet} from "../../../types/GameTypes";
import LenyaBasicAttack from "./LenyaBasicAttack";
import LenyaSignature1 from "./LenyaSignature1";
import LenyaSignature2 from "./LenyaSignature2";
import LenyaUltimate from "./LenyaUltimate";

export default class CharacterLenya extends Character {

    static override id = CharacterList.Lenya;

    static override characterName = "Lenya";

    static override maxHealth = 640;
    static override maxUltimateCharge = 700;

    static override abilities: AbilitySet = [
        LenyaBasicAttack,
        LenyaSignature1,
        LenyaSignature2,
        LenyaUltimate
    ];

}