import CharacterGramin from "./characters/CharacterGramin";
import CharacterKenn from "./characters/CharacterKenn";
import CharacterLenya from "./characters/CharacterLenya";
import CharacterList from "./CharacterList";
import CharacterMasr from "./characters/CharacterMasr";

export default class CharacterRepository {

    static get(id: CharacterList){

        switch(id){

            case CharacterList.Kenn: //Kenn
            {
                return CharacterKenn(id);
            }
            case CharacterList.Gramin: 
            {
                return CharacterGramin(id);
                
            }
            case CharacterList.Lenya: 
            {
                return CharacterLenya(id);
            }

            case CharacterList.Masr:
            {
                return CharacterMasr(id);
            }

            default:
                return CharacterKenn(1);
    
        }

    }

}