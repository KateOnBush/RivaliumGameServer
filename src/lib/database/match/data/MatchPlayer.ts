import MatchPlayerData from "./MatchPlayerData";
import CharacterList from "../../../gamedata/CharacterList";

export default class MatchPlayer {

    userId: string;
    playerId: number;
    charId: CharacterList;
    joined: boolean = false;
    data: MatchPlayerData;
    access: number;

    constructor(userId: string) {
        this.userId = userId;
        this.access = 0x0;
    }

}