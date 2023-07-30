import {AbilitySet} from "../types/GameTypes";


export default interface ICharacter {

    id: number;
    name: string;
    health: number;
    healthMax: number;
    ultimateCharge: number;
    ultimateChargeMax: number;
    abilities: AbilitySet;

}