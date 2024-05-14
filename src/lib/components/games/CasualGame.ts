import TResCasualGameState from "../../networking/tcp/response/TResCasualGameState";
import ETimerType from "../../enums/ETimerType";
import Game from "../Game";
import TResTimerUpdate from "../../networking/tcp/response/TResTimerUpdate";
import Player from "../Player";

export enum CasualGameState {

    STARTING,
    PREROUND,
    BATTLE,
    SUDDENDEATH

}

enum RoundPhase {
    PREPARATION,
    FIRST_BATTLE,
    //orbstone spawn
    SECOND_BATTLE,
    //orbstone spawn
    FINAL_BATTLE
}

export default class CasualGame extends Game {

    state: CasualGameState = CasualGameState.STARTING;

    currentRound: number = 0;
    currentRoundPhase: RoundPhase = RoundPhase.PREPARATION;

    currentlyDefending: number = 0;
    team0score: number = 0;
    team1score: number = 0;

    override start() {
        this.updateState();
        this.announceAllPlayers();
        this.setup();
        this.started = true;
    }

    setup() {
        this.startRound();
    }

    startBattle() {
        if (this.currentRound == 9) this.changeState(CasualGameState.SUDDENDEATH)
        else this.changeState(CasualGameState.BATTLE);
    }

    startRound() {
        this.currentRound++;
        this.currentlyDefending = 1 - this.currentlyDefending;
        this.currentRoundPhase = RoundPhase.PREPARATION;
        this.changeState(CasualGameState.PREROUND);
        this.assignNewGemHolder();
    }

    changeState(newState: CasualGameState) {
        this.state = newState;
        this.updateState();
        let timerUpdate = new TResTimerUpdate();
        if (newState == CasualGameState.PREROUND) {
            this.players.forEach(player => {
                if (player.dead) player.respawn();
                player.state.blocked = 1;
            });
            timerUpdate.timer = 5;
            timerUpdate.timerType = ETimerType.PRE_ROUND;
            setTimeout(()=> {
                this.startBattle();
            }, 5000);
        } else if (newState == CasualGameState.BATTLE){
            this.players.forEach(player => player.state.blocked = 0);
            this.currentRoundPhase++;
            if (this.currentRoundPhase == RoundPhase.FINAL_BATTLE) {
                timerUpdate.timer = 150;
                timerUpdate.timerType = ETimerType.ROUND_END;
                setTimeout(() => {
                    this.startRound();
                }, 60 * 1000);
            } else {
                timerUpdate.timer = this.currentRoundPhase == RoundPhase.FIRST_BATTLE ? 60 : 120;
                timerUpdate.timerType = ETimerType.NEXT_ORBSTONE_SPAWNS;
                setTimeout(() => {
                    this.changeState(CasualGameState.BATTLE);
                }, timerUpdate.timer * 1000);
            }
        }
        this.broadcast(timerUpdate);
    }

    updateState() {
        let stateUpdate = new TResCasualGameState();
        stateUpdate.state = this.state;
        stateUpdate.currentRound = this.currentRound;
        stateUpdate.firstTeamScore = this.team0score;
        stateUpdate.secondTeamScore = this.team1score;
        stateUpdate.defendingTeam = this.currentlyDefending;
        this.broadcast(stateUpdate);
    }

    assignNewGemHolder() {
        this.players.forEach(player => {
            player.gemHolder = 0;
        });
        let defendingPlayers = this.players.filter(player => player.team == this.currentlyDefending && !player.dead);
        let index = Math.floor(Math.random() * defendingPlayers.length);
        if (defendingPlayers.length > 0) defendingPlayers[index].gemHolder = 1;
    }

    override onKill(victim: Player, killer: Player) {
        if (victim.gemHolder) this.assignNewGemHolder();
        this.addOrb(Math.floor(Math.random() * 3), victim.x, victim.y, killer);
    };

}