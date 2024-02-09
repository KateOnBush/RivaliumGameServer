import {Repository} from "mongodb-typescript";
import {MongoClient, ObjectId} from "mongodb";
import Match from "./match/Match";
import {MatchState} from "./match/MatchTypes";
import Game from "../components/Game";
import Logger from "../tools/Logger";
import TCPPlayerSocket from "../networking/tcp/TCPPlayerSocket";


const uri = "mongodb://127.0.0.1:27017";
let DatabaseClient = new MongoClient(uri);
let MatchRepository = new Repository<Match>(Match, DatabaseClient, "match", { databaseName: "epicgame" });

class DatabaseCache {
    static matches: Match[] = [];
}

export default class Database {

    static games: Game[] = [];

    static async lookupUninitializedMatches() {

        const filter = { state: MatchState.AWAITING_INITIATION };

        Logger.log("Looking up uninitialized matches...");

        let matches = await MatchRepository.find(filter).toArray();

        for(const match of matches) {
            Logger.success("Found new match: {0}, starting...", match.getID());
            DatabaseCache.matches.push(match);
            match.state = MatchState.AWAITING_PLAYERS;
            this.registerGame(match);
            await this.saveMatch(match);
        }

    }

    static registerGame(match: Match) {
        let game = new Game(match.type, match.getID());
        match.game = game;
        this.games.push(game);
    }

    static async saveMatch(match: Match) {
        await MatchRepository.save(match);
    }

    static async fetchMatch(id: string){

        let cached = DatabaseCache.matches.find(m => m.getID() == id);
        if (cached) return cached;
        else {
            let fetched = await MatchRepository.findById(new ObjectId(id));
            if (fetched) DatabaseCache.matches.push(fetched);
            return fetched;
        }

    }

    static async fetchMatchByPass(pass: number) {

        let cached = DatabaseCache.matches.find(m => m.pass == pass && m.state != MatchState.FINISHED);
        if (cached) return cached;

    }

    static async verifyPlayer(socket: TCPPlayerSocket, pass: number, access: number): Promise<Match | null>{

        await this.lookupUninitializedMatches();

        let match = await this.fetchMatchByPass(pass);
        if (!match) return null;

        let teamNumber: number = 0;
        for(const team of match.playerManager.players) {
            for(const matchPlayer of team){
                if (matchPlayer.access == access) {
                    matchPlayer.joined = true;
                    let alreadyExistingPlayer = match.game.players.find(p => p.id == matchPlayer.playerId);
                    socket.player = alreadyExistingPlayer ?? match.game.addPlayer(socket, matchPlayer.charId, matchPlayer.playerId, teamNumber);
                    socket.game = match.game;
                    socket.player.matchPlayer = matchPlayer;
                    await this.saveMatch(match);
                    break;
                }
            }
            teamNumber++;
        }
        if (!socket.player) return null;

        return match;

    }

}