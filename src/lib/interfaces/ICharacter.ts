import {AbilitySet} from "../types/GameTypes";
import CharacterList from "../gamedata/CharacterList";


export default interface ICharacter {

    id: CharacterList;
    name: string;
    health: number;
    healthMax: number;
    ultimateCharge: number;
    ultimateChargeMax: number;
    abilities: AbilitySet;

}