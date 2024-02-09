import {PlayerID} from "../MatchTypes";

export default class MatchPlayerEvent {

    source: PlayerID;
    target: PlayerID;
    time: number;
    amount: number[] | number;

}