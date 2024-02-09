export enum MatchType {

    CASUAL,
    RANKED,
    EXCLUSIVE

}

export enum MatchState {

    AWAITING_INITIATION,
    AWAITING_PLAYERS,
    LOADING,
    STARTED,
    FINISHED

}

export enum PlayerLeaverDegree {

    NOT_LEAVER,
    LOWER_THAN_200MS,
    HIGHER_THAN_200MS,
    HIGHER_THAN_500MS

}

export type PlayerID = ComponentID;
export type ComponentID = number;