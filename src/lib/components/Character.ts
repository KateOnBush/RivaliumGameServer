import ICharacter from "../interfaces/ICharacter";
import {AbilitySetInitializer} from "../types/GameTypes";

export default class Character {

    static builder(name: string, health: number, ultimatecharge: number, abilities: AbilitySetInitializer): (id: number) => ICharacter{

        return (_id: number)=>{
            
            return {

                id: _id,
                name,
                health,
                healthMax: health,
                ultimateCharge: 0,
                ultimateChargeMax: ultimatecharge,
                abilities: abilities()

            };

        }

    }

}