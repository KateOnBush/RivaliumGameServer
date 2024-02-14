import CharacterRepository from "../gamedata/CharacterRepository";
import ICharacter from "../interfaces/ICharacter";
import TCPPlayerSocket from "../networking/tcp/TCPPlayerSocket";
import GMBuffer from "../tools/GMBuffer";
import GM from "../tools/GMLib";
import Vector2 from "../tools/vector/Vector2";
import {EffectData} from "../types/GameTypes";
import GamePhysicalElement from "./abstract/GamePhysicalElement";
import PlayerPing from "./sub/PlayerPing";
import PlayerState from "./sub/PlayerState";
import MatchPlayer from "../database/match/data/MatchPlayer";
import EPlayerState from "../enums/EPlayerState";
import {FormattedPacket} from "../networking/FormattedPacket";
import EPacketChannel from "../enums/EPacketChannel";
import UResPlayerHit from "../networking/udp/response/UResPlayerHit";
import TResEffectAdd from "../networking/tcp/response/TResEffectAdd";
import TResPlayerForcedDash from "../networking/tcp/response/TResPlayerForcedDash";
import TResPlayerDeath from "../networking/tcp/response/TResPlayerDeath";
import UDPPlayerSocket from "../networking/udp/UDPPlayerSocket";

export enum PlayerEffect {

    NONE,
    HEAL,
    BURN,
    ACCELERATE,
    SLOW,
    VULNERABILITY,
    INVISIBILITY
}

export default class Player extends GamePhysicalElement {

    TCPsocket: TCPPlayerSocket;
    UDPsocket: UDPPlayerSocket = new UDPPlayerSocket("", 0);

    mouse: Vector2 = new Vector2();
    state: PlayerState = new PlayerState();

    char: ICharacter;
    ping: PlayerPing = new PlayerPing();

    kills: number = 0;
    deaths: number = 0;
    assists: number = 0;

    matchPlayer: MatchPlayer;

    team: number = 0;

    effectTimeouts: NodeJS.Timeout[] = [];


    constructor(socket: TCPPlayerSocket, id: number, charid: number, team: number = 0, position?: Vector2, state?: PlayerState){

        super();
        this.TCPsocket = socket;
        this.id = id;
        if (position) this.pos = position;
        if (state) this.state = state;
        this.char = CharacterRepository.get(charid);
        this.team = team;

    }

    reset(){

        this.char = CharacterRepository.get(this.char.id);

    }

    hit(damage: number, attacker: Player, visual: boolean = true) {

        if (this.state.id == EPlayerState.DEAD) return;
        if (this.team == attacker.team) return;

        attacker.char.ultimateCharge += damage;
        if (attacker.char.ultimateCharge > attacker.char.ultimateChargeMax) attacker.char.ultimateCharge = attacker.char.ultimateChargeMax;

        this.char.health -= damage;
        if (this.char.health < 0) {
            this.char.health = 0;
            this.dead = 1;
            this.kill(attacker);

        }

        let playerHit = new UResPlayerHit();
        playerHit.playerId = this.id;
        playerHit.attackerId = attacker.id;
        playerHit.visual = visual;

        this.game?.broadcast(playerHit);

    }

    get mouseDirection(){

        return GM.point_direction(this.x, this.y, this.mouse.x, this.mouse.y);
        
    }

    burn(damage: number, attacker: Player){

        let time = (damage/5) | 0;

        this.addEffect(PlayerEffect.BURN, time * .25);

        for(let i = 0; i < time; i++){

            this.effectTimeouts.push(setTimeout(()=>{

                this.hit(damage / 5 | 0, attacker, false);
                
            }, (i+1)*250));

        }

    }

    healInstantly(amt: number){

        if (this.state.dead == 1) return;

        this.char.health += amt;
        if (this.char.health > this.char.healthMax){
            this.char.health = this.char.healthMax;
        }

    }

    heal(amt: number, time: number){

        if (this.state.id != EPlayerState.DEAD) return;

        let n = time * 4 | 0;
        let amtPr = amt/n | 0;

        this.addEffect(PlayerEffect.HEAL, time);

        for(let i = 0; i < n; i++){

            this.effectTimeouts.push(setTimeout(()=>{

                this.healInstantly(amtPr);

            }, (i+1)*250));

        }

    }

    addEffect(type: PlayerEffect, duration: number, data: EffectData = {}) {

        let effectAdd = new TResEffectAdd();
        effectAdd.playerId = this.id;
        effectAdd.duration = duration;
        effectAdd.type = type;
        if (data.multiplier) effectAdd.multiplier = data.multiplier;

        this.game?.broadcast(effectAdd);

    }

    send(packet: FormattedPacket){

        let bakedPacket = packet.bake();
        if ((packet.constructor as typeof FormattedPacket).channel == EPacketChannel.TCP) {
            this.TCPsocket.send(bakedPacket.getBuffer());
            return;
        }
        this.UDPsocket.send(bakedPacket.getBuffer());

    }

    sendRawTCP(buffer: GMBuffer) {
        this.TCPsocket.send(buffer.getBuffer());
    }
    sendRawUDP(buffer: GMBuffer) {
        this.UDPsocket.send(buffer.getBuffer());
    }

    forceDash(direction: number, time: number, mult: number){

        let forcedDash = new TResPlayerForcedDash();

        this.mov = Vector2.polar(1, direction);
        this.mov.multiply(30 * mult);

        forcedDash.playerId = this.id;
        forcedDash.direction = direction;
        forcedDash.time = time;
        forcedDash.mult = mult;

        this.game?.broadcast(forcedDash);

    }

    kill(killer: Player) {

        let playerDeath = new TResPlayerDeath();
        playerDeath.victim = this.id;
        playerDeath.killer = killer.id;

        this.game?.broadcast(playerDeath);

    }


}