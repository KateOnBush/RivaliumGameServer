import Character from "../../../components/abstract/Character";
import CharacterList from "../../CharacterList";
import KennBasicAttack from "./KennBasicAttack";
import KennSignature1 from "./KennSignature1";
import KennSignature2 from "./KennSignature2";
import KennUltimate from "./KennUltimate";
import {AbilitySet} from "../../../types/GameTypes";
import Player, {PlayerEffect} from "../../../components/Player";

export default class CharacterKenn extends Character {

    static override id = CharacterList.Kenn;

    static override characterName = "Kenn";

    static override maxHealth = 550;
    static override maxUltimateCharge = 1300;

    static override abilities: AbilitySet = [
        KennBasicAttack,
        KennSignature1,
        KennSignature2,
        KennUltimate
    ];

    static override onKill(player: Player, victim: Player) {
        player.addEffect(PlayerEffect.INVISIBILITY, 1);
        player.heal(50, 1);
    }

}