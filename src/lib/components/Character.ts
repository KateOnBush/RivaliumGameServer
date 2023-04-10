import ICharacter from "../interfaces/ICharacter";
import { AbilitySet } from "../types/GameTypes";

export default class Character {

    static builder(name: string, health: number, ultimatecharge: number, abilities: AbilitySet): (id: number) => ICharacter{

        return (_id: number)=>{
            
            return {

                id: _id,
                name,
                health,
                healthmax: health,
                ultimatecharge,
                ultimatechargemax: ultimatecharge,
                abilities

            };

        }

    }

}