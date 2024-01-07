import CharacterRepository from "../gamedata/CharacterRepository";
import {dataSize} from "../Macros";
import {TCPServerResponse} from '../enums/TCPPacketTypes';
import ICharacter from "../interfaces/ICharacter";
import PlayerSocket from "../interfaces/IPlayerSocket";
import GMBuffer from "../tools/GMBuffer";
import GM from "../tools/GMLib";
import Vector2 from "../tools/vector/Vector2";
import {EffectData} from "../types/GameTypes";
import GamePhysicalElement from "./abstract/GamePhysicalElement";
import PlayerPing from "./sub/PlayerPing";
import PlayerState from "./sub/PlayerState";
import EBufferType from "../enums/EBufferType";
import MatchPlayer from "../database/match/data/MatchPlayer";
import EPlayerState from "../enums/EPlayerState";
import {UDPServerResponse} from "../enums/UDPPacketTypes";

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

    socket: PlayerSocket;
    charid: number;

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


    constructor(socket: PlayerSocket, id: number, charid: number, team: number = 0, position?: Vector2, state?: PlayerState){

        super();
        this.socket = socket;
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
        //if (this.team == attacker.team) return;

        attacker.char.ultimateCharge += damage;
        if (attacker.char.ultimateCharge > attacker.char.ultimateChargeMax) attacker.char.ultimateCharge = attacker.char.ultimateChargeMax;

        this.char.health -= damage;
        if (this.char.health < 0) {
            this.char.health = 0;
            this.dead = 1;
            this.kill(attacker);

        }

        var hitbuff = GMBuffer.allocate(dataSize);
        hitbuff.write(TCPServerResponse.PLAYER_HIT, EBufferType.UInt8);
        hitbuff.write(this.id, EBufferType.UInt16);
        hitbuff.write(attacker.id, EBufferType.UInt16);
        hitbuff.write(visual ? 1 : 0, EBufferType.UInt8);

        this.game?.broadcast(hitbuff);

    }

    get mouseDirection(){

        return GM.point_direction(this.x, this.y, this.mouse.x, this.mouse.y);
        
    }

    burn(damage: number, attacker: Player){

        let time = (damage/5) | 0;

        this.addEffect(PlayerEffect.BURN, time * .25);

        for(var i = 0; i < time; i++){

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

        let _b = GMBuffer.allocate(dataSize);
        _b.write(TCPServerResponse.EFFECT_ADD, EBufferType.UInt8);
        _b.write(this.id, EBufferType.UInt16)
        _b.write(type, EBufferType.UInt8);
        _b.write(duration * 100, EBufferType.UInt16);

        if ([PlayerEffect.ACCELERATE, PlayerEffect.SLOW].includes(type) && data.multiplier) { //Speed or boost
            _b.write(data.multiplier * 100 | 0, EBufferType.UInt16);
        }

        this.game?.broadcast(_b);

    }

    send(buffer: GMBuffer){

        this.socket.send(buffer.getBuffer());

    }

    forceDash(direction: number, time: number, mult: number){

        this.mov = Vector2.polar(1, direction);
        this.mov.multiply(30 * mult);

        let buff = GMBuffer.allocate(dataSize);
        buff.write(UDPServerResponse.PLAYER_FORCED_DASH, EBufferType.UInt8);
        buff.write(this.id, EBufferType.UInt16);
        buff.write(direction * 100 | 0, EBufferType.SInt16);
        buff.write(time * 100 | 0, EBufferType.UInt16);
        buff.write(mult * 100 | 0, EBufferType.UInt16);

        this.game?.broadcast(buff);

    }

    kill(killer: Player) {

        var buff = GMBuffer.allocate(dataSize);

        buff.write(TCPServerResponse.PLAYER_DEATH, EBufferType.UInt8);
        buff.write(this.id, EBufferType.UInt16);
        buff.write(killer.id, EBufferType.UInt16);

        this.game?.broadcast(buff);

    }


}