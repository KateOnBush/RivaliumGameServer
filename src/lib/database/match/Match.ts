import {id, ignore} from 'mongodb-typescript';
import MatchPlayerManager from './MatchPlayerManager';
import {ObjectId} from 'mongodb';
import {MatchState, MatchType} from "./MatchTypes";
import Game from "../../components/Game";

export default class Match {

    @id
    id: ObjectId;
    type: MatchType = MatchType.CASUAL;
    state: MatchState = MatchState.AWAITING_INITIATION;
    playerManager: MatchPlayerManager = new MatchPlayerManager();
    createdAt: number = Date.now();
    endedAt: number = Date.now();
    pass: number;

    @ignore
    game: Game;

    getID() {
        return this.id.toString();
    }

}