import CharacterList from "./CharacterList";
import CharacterMasr from "./characters/Masr/CharacterMasr";
import CharacterKenn from "./characters/Kenn/CharacterKenn";
import Character from "../components/abstract/Character";
import CharacterGramin from "./characters/Gramin/CharacterGramin";
import CharacterLenya from "./characters/Lenya/CharacterLenya";

export default class CharacterRepository {

    static get(id: CharacterList): typeof Character{

        switch(id){

            case CharacterList.Kenn: //Kenn
            {
                return CharacterKenn;
            }
            case CharacterList.Gramin: 
            {
                return CharacterGramin;
                
            }
            case CharacterList.Lenya: 
            {
                return CharacterLenya;
            }

            case CharacterList.Masr:
            {
                return CharacterMasr;
            }
            default:
                return CharacterKenn;
    
        }

    }

}