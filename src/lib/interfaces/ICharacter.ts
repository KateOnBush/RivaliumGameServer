import { AbilitySet } from "../types/GameTypes";


export default interface ICharacter {

    id: number;
    name: string;
    health: number;
    healthmax: number;
    ultimatecharge: number;
    ultimatechargemax: number;
    abilities: AbilitySet;

}