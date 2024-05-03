import {AbilitySet} from "../../types/GameTypes";
import CharacterList from "../../gamedata/CharacterList";
import Player from "../Player";

export enum CharacterUltimateChargeType {
    DAMAGE,
    HEAL
}

export default abstract class Character {

    static id: CharacterList;
    static characterName: string;
    static maxHealth: number;
    static maxUltimateCharge: number;

    static ultimateChargeType: CharacterUltimateChargeType = CharacterUltimateChargeType.DAMAGE;

    static abilities: AbilitySet;

    static onKill(player: Player, victim: Player) {};
    static onDeath(player: Player, killer: Player) {};

}