import Character from "../../../components/abstract/Character";
import CharacterList from "../../CharacterList";
import {AbilitySet} from "../../../types/GameTypes";
import GraminBasicAttack from "./GraminBasicAttack";
import GraminSignature1 from "./GraminSignature1";
import GraminSignature2 from "./GraminSignature2";
import GraminUltimate from "./GraminUltimate";

export default class CharacterGramin extends Character {

    static override id = CharacterList.Gramin;

    static override characterName = "Gramin";

    static override maxHealth = 480;
    static override maxUltimateCharge = 1800;

    static override abilities: AbilitySet = [
        GraminBasicAttack,
        GraminSignature1,
        GraminSignature2,
        GraminUltimate
    ];

}