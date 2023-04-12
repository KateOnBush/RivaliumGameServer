import CharacterGramin from "./characters/CharacterGramin";
import CharacterKenn from "./characters/CharacterKenn";
import CharacterLenya from "./characters/CharacterLenya";

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