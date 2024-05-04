import CharacterRepository from "../gamedata/CharacterRepository";
import TCPPlayerSocket from "../networking/tcp/TCPPlayerSocket";
import GMBuffer from "../tools/GMBuffer";
import GM from "../tools/GMLib";
import Vector2 from "../tools/vector/Vector2";
import {NumericBoolean} from "../types/GameTypes";
import GamePhysicalElement from "./abstract/GamePhysicalElement";
import PlayerPing from "./sub/PlayerPing";
import PlayerState from "./sub/PlayerState";
import MatchPlayer from "../database/match/data/MatchPlayer";
import EPlayerState from "../enums/EPlayerState";
import {FormattedPacket} from "../networking/FormattedPacket";
import EPacketChannel from "../enums/EPacketChannel";
import UResPlayerHit from "../networking/udp/response/UResPlayerHit";
import UResEffectAdd from "../networking/udp/response/UResEffectAdd";
import TResPlayerForcedDash from "../networking/tcp/response/TResPlayerForcedDash";
import TResPlayerDeath from "../networking/tcp/response/TResPlayerDeath";
import UDPPlayerSocket from "../networking/udp/UDPPlayerSocket";
import UResPlayerHeal from "../networking/udp/response/UResPlayerHeal";
import {PlayerID} from "../database/match/MatchTypes";
import TResPlayerStatsUpdate from "../networking/tcp/response/TResPlayerStatsUpdate";
import Character, {CharacterUltimateChargeType} from "./abstract/Character";
import Ability from "./abstract/Ability";
import UResEffectRemove from "../networking/udp/response/UResEffectRemove";

export enum PlayerEffect {

    NONE,

    HEAL,
    BURN,

    //buffs
    AGILITY,
    SWIFTNESS,
    INVISIBILITY,
    POWER,
    SHIELDING,
    REDEMPTION,
    PROTECTION,

    //nerfs
    VULNERABILITY,
    SLOWNESS,
    SHATTERING,
    IMPOTENCE,
    LETHARGY, // -% haste
    BLIND,

    SPECTRE,
    STORMWRATH

}

interface AttackData {
    id: PlayerID,
    time: number
}

export default class Player extends GamePhysicalElement {

    TCPsocket: TCPPlayerSocket;
    UDPsocket: UDPPlayerSocket = new UDPPlayerSocket("", 0);

    mouse: Vector2 = new Vector2();
    state: PlayerState = new PlayerState();

    character: typeof Character;
    ping: PlayerPing = new PlayerPing();
    abilities: Ability[] = [];

    health: number = 0;
    ultimateCharge: number = 0;
    get maxHealth() {return this.character.maxHealth;}
    get maxUltimateCharge() {return this.character.maxUltimateCharge;}

    kills: number = 0;
    deaths: number = 0;
    assists: number = 0;

    lethality: number = 5;
    resistance: number = 8;
    haste: number = 3;

    boost: number = 1;
    boostTimeouts: NodeJS.Timeout[] = [];

    matchPlayer: MatchPlayer;

    team: number = 0;

    gemHolder: NumericBoolean = 0;
    gemPlants: number = 0;

    effectTimeouts: NodeJS.Timeout[] = [];
    actionTimeouts: NodeJS.Timeout[] = []; //TODO: Add all actions in here

    lastAttacked: AttackData[] = [];

    redemptiveUntil: number = 0;
    protectedUntil: number = 0;
    get redemptive() { return this.redemptiveUntil > Date.now(); }
    get protected() { return this.protectedUntil > Date.now(); }
    setRedemptive(duration: number) { this.redemptiveUntil = Math.max(this.redemptiveUntil, Date.now() + duration); }
    setProtected(duration: number) { this.protectedUntil = Math.max(this.protectedUntil, Date.now() + duration); }
    removeProtection() {this.protectedUntil = 0;}

    constructor(socket: TCPPlayerSocket, id: number, charId: number, team: number = 0, position?: Vector2, state?: PlayerState){

        super();
        this.TCPsocket = socket;
        this.id = id;
        if (position) this.pos = position;
        if (state) this.state = state;
        this.character = CharacterRepository.get(charId);
        this.abilities = this.character.abilities.map(abilityInitializer => new abilityInitializer(this));
        this.health = this.maxHealth;
        this.ultimateCharge = this.maxUltimateCharge;
        this.team = team;

    }

    updateStats() {
        let updatedStats = new TResPlayerStatsUpdate();
        updatedStats.playerId = this.id;
        updatedStats.kills = this.kills;
        updatedStats.deaths = this.deaths;
        updatedStats.assists = this.assists;
        updatedStats.gemPlants = this.gemPlants;
        this.game.broadcast(updatedStats);
    }

    applyBoost(multiplier: number, time: number) {
        this.boost *= multiplier;
        let timeout = setTimeout(()=>{
            this.boost /= multiplier;
        }, time * 1000);
        this.boostTimeouts.push(timeout);
    }

    get dead() { return this.state.id == EPlayerState.DEAD };

    hit(damage: number, attacker: Player, visual: boolean = true, burn = false) {

        if (this.state.id == EPlayerState.DEAD) return;
        if (this.team == attacker.team) return;

        if (!burn && this.protected) {
            this.removeEffect(PlayerEffect.PROTECTION);
            this.removeProtection();
        }
        if (this.redemptive) return;

        this.lastAttacked = this.lastAttacked.filter(attackData => attackData.id != attacker.id);
        if (this.lastAttacked.length > 4) this.lastAttacked.shift();
        this.lastAttacked.push({id: attacker.id, time: Date.now()});

        damage += damage * (0.02 * attacker.lethality);
        damage -= damage * (0.025 * this.resistance);
        damage = Math.round(damage);

        damage = Math.min(damage, this.health);

        if (attacker.character.ultimateChargeType == CharacterUltimateChargeType.DAMAGE) {
            attacker.ultimateCharge += damage;
            if (attacker.ultimateCharge > attacker.maxUltimateCharge) attacker.ultimateCharge = attacker.maxUltimateCharge;
        }

        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.kill(attacker);
        }

        if (visual) {
            let playerHit = new UResPlayerHit();
            playerHit.playerId = this.id;
            playerHit.attackerId = attacker.id;
            this.game.broadcast(playerHit);
        }


    }

    get mouseDirection(){

        return GM.point_direction(this.x, this.y, this.mouse.x, this.mouse.y);
        
    }

    burn(damage: number, attacker: Player, seconds: number){

        this.addEffect(PlayerEffect.BURN, seconds);

        for(let i = 0; i < seconds; i++){

            this.effectTimeouts.push(setTimeout(()=>{

                this.hit(damage / seconds, attacker, false, true);
                
            }, (i+1)*1000));

        }

    }

    healInstantly(amt: number, healer: Player = this, visual = true, gradual = false){

        if (this.state.id == EPlayerState.DEAD) return;

        if (!gradual) amt += this.resistance * 2;

        amt = Math.min(amt, this.maxHealth - this.health);

        if (healer.character.ultimateChargeType == CharacterUltimateChargeType.HEAL) {
            healer.ultimateCharge += amt;
            healer.ultimateCharge = Math.min(healer.ultimateCharge, healer.maxUltimateCharge);
        }

        this.health += amt;

        if (visual) {
            let playerHeal = new UResPlayerHeal();
            playerHeal.playerId = this.id;
            this.game.broadcast(playerHeal);
        }

    }

    heal(amt: number, time: number, healer: Player = this){

        if (this.state.id == EPlayerState.DEAD) return;

        amt += this.resistance * 10;

        let n = time * 4 | 0;
        let amtPr = amt/n | 0;

        this.addEffect(PlayerEffect.HEAL, time);

        for(let i = 0; i < n; i++){

            this.effectTimeouts.push(setTimeout(()=>{

                this.healInstantly(amtPr, this, false, true);

            }, (i+1)*250));

        }

    }

    addEffect(type: PlayerEffect, duration: number) {

        let effectAdd = new UResEffectAdd();
        effectAdd.playerId = this.id;
        effectAdd.duration = duration;
        effectAdd.type = type;

        this.game.broadcast(effectAdd);

    }

    removeEffect(type: PlayerEffect) {
        let effectAdd = new UResEffectRemove();
        effectAdd.playerId = this.id;
        effectAdd.type = type;
        this.game.broadcast(effectAdd);
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

        this.game.broadcast(forcedDash);

    }

    kill(killer: Player) {

        this.game.onKill(this, killer);
        this.character.onDeath(this, killer);
        killer.character.onKill(killer, this);

        this.deaths++;
        killer.kills++;

        this.gemHolder = 0;

        this.updateStats();
        killer.updateStats();

        let respawnTime = Math.floor(15 + this.deaths * 0.6 - this.kills * 0.2);

        let playerDeath = new TResPlayerDeath();
        playerDeath.victim = this.id;
        playerDeath.killer = killer.id;
        playerDeath.respawnTime = respawnTime;
        let attackers = this.lastAttacked.filter(attackData => attackData.id != killer.id).map(attackData => attackData.id);
        attackers.forEach(attackerId => {
           let attacker = this.game.getPlayer(attackerId);
           if (attacker) {
               attacker.assists++;
               attacker.updateStats();
           }
        });
        if (attackers.length > 0) playerDeath.assist1 = attackers[0];
        if (attackers.length > 1) playerDeath.assist2 = attackers[1];
        if (attackers.length > 2) playerDeath.assist3 = attackers[3];
        if (attackers.length > 3) playerDeath.assist4 = attackers[4];

        this.game.broadcast(playerDeath);

        setTimeout(() => {
            this.respawn();
        }, respawnTime * 1000);

    }

    respawn() {
        this.state.id = EPlayerState.FREE;
        //TELEPORT TO A NEW SPOT
    }


}