import CharacterGramin from "./game/characters/CharacterGramin";
import CharacterKenn from "./game/characters/CharacterKenn";
import CharacterLenya from "./game/characters/CharacterLenya";

export default class CharacterRepository {

    static get(id: number){

        switch(id){

            case 1: //Kenn
            {
                return CharacterKenn(id);
            }
            case 2: 
            {
                return CharacterGramin(id);
                
            }
            case 3: 
            {
                return CharacterLenya(id);
            }

            default:
                return CharacterKenn(1);
    
        }

    }

}