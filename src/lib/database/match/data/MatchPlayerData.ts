import MatchPlayerEvent from "./MatchPlayerEvent";
import {PlayerLeaverDegree} from "../MatchTypes";

export default class MatchPlayerData {

    kills: MatchPlayerEvent[] = [];
    deaths: MatchPlayerEvent[] = [];
    assists: MatchPlayerEvent[] = [];
    gemsPlanted: MatchPlayerEvent;

    damageDone: number = 0;
    damageTaken: number = 0;
    healingDone: number = 0;
    healingTaken: number = 0;
    burnDone: number = 0;
    burnTaken: number = 0;

    leaver: PlayerLeaverDegree = PlayerLeaverDegree.NOT_LEAVER;

}