import CharacterRepository from "../gamedata/CharacterRepository";
import { dataSize } from "../Macros";
import { EServerResponse, EServerRequest } from '../enums/EPacketTypes';
import ICharacter from "../interfaces/ICharacter";
import PlayerSocket from "../interfaces/IPlayerSocket";
import GMBuffer from "../tools/GMBuffer";
import GM from "../tools/GMLib";
import Vector2 from "../tools/vector/Vector2";
import { EffectData } from "../types/GameTypes";
import Game from "./Game";
import GamePhysicalElement from "./abstract/GamePhysicalElement";
import PlayerPing from "./sub/PlayerPing";
import PlayerState from "./sub/PlayerState";
import EBufferType from "../enums/EBufferType";

export enum EFFECT {
        
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

    effectTimeouts: NodeJS.Timeout[] = [];


    constructor(socket: PlayerSocket, id: number, charid: number, position?: Vector2, state?: PlayerState){

        super();
        this.socket = socket;
        this.id = id;
        if (position) this.pos = position;
        if (state) this.state = state;
        this.char = CharacterRepository.get(charid);

    }

    reset(){

        this.char = CharacterRepository.get(this.char.id);

    }

    hit(damage: number, attacker: Player){

        if (this.state.dead == 1) return;

        this.char.health -= damage;
        if (this.char.health < 0)
        {
            this.char.health = 0;

        }

        var hitbuff = Buffer.alloc(dataSize);
		hitbuff.writeUInt8(EServerResponse.PLAYER_HIT, 0)
		hitbuff.writeUInt16LE(this.id, 1);
		hitbuff.writeUInt16LE(attacker.id, 3);

        if (this.game) this.game.players.forEach(p=>{

            p.socket.send(hitbuff);

        });

    }

    get mouseDirection(){

        return GM.point_direction(this.x, this.y, this.mouse.x, this.mouse.y);
        
    }

    burn(damage: number, attacker: Player){

        let time = (damage/5) | 0;

        this.addEffect(EFFECT.BURN, time * .25);

        for(var i = 0; i < time; i++){

            this.effectTimeouts.push(setTimeout(()=>{

                this.hit(damage/5 | 0, attacker);
                
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

        if (this.state.dead == 1) return;

        let n = time * 4 | 0;
        let amtpr = amt/n | 0;

        this.addEffect(EFFECT.HEAL, time);

        for(var i = 0; i < n; i++){

            this.effectTimeouts.push(setTimeout(()=>{

                this.healInstantly(amtpr);

            }, (i+1)*250));

        }

    }

    addEffect(type: EFFECT, duration: number, data: EffectData = {}){

        let _b = Buffer.alloc(dataSize);
		_b.writeUInt8(EServerResponse.EFFECT_ADD, 0);
		_b.writeUInt16LE(this.id, 1)
		_b.writeUInt8(type, 3);
		_b.writeUInt16LE(duration * 100, 4);

        if ([EFFECT.BURN, EFFECT.HEAL].includes(type) && data.multiplier) { //Speed or boost
            _b.writeUInt16LE(data.multiplier * 100, 6);
        }

        if (this.game) this.game.players.forEach(p=>{
            p.socket.send(_b);
        });

    }

    send(buffer: GMBuffer){

        this.socket.send(buffer.getBuffer());

    }

    forceDash(direction: number, time: number, mult: number){

        this.mov = Vector2.polar(1, direction);
        this.mov.multiply(30 * mult);

        let buff = GMBuffer.allocate(dataSize);
        buff.write(EServerResponse.PLAYER_FORCED_DASH, EBufferType.UInt8);
        buff.write(this.id, EBufferType.UInt16);
        buff.write(direction * 100 | 0, EBufferType.SInt16);
        buff.write(time * 100 | 0, EBufferType.UInt16);
        buff.write(mult * 100 | 0, EBufferType.UInt16);

        this.game?.broadcast(buff);

    }


}