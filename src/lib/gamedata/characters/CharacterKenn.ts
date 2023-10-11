import Lag from "../../tools/Lag";
import Ability from "../../components/Ability";
import EAbilityType from "../../enums/EAbilityType";
import Character from "../../components/Character";
import Player, {EFFECT} from "../../components/Player";
import {ActiveAbilityData, NoAbilityData} from "../../components/sub/AbilityData";
import {EMPTY_METHOD} from "../../Macros";
import ProjectileList from "../instancelist/ProjectileList";

export default Character.builder(
    "Kenn",
    550,
    220,

    () => [

        new Ability(EAbilityType.ONETIME, [0.3, 1], NoAbilityData, function (n: number, player: Player) {
            if (!player.game) return;
            const pred = Lag.predictNextPosition(player);
            let inUlt = player.char.abilities[3].data.active;
            let bleeds = player.char.abilities[1].data.active;
            let projectile = inUlt ? ProjectileList.KennDaggerTransformed : ProjectileList.KennDagger;
            for (let i = 0; i < (n == 1 ? 4 : 1); i++) {
                player.game.addProjectile(
                    player,
                    projectile,
                    pred.pos.x,
                    pred.pos.y,
                    70,
                    player.mouseDirection + (n == 1 ? Math.random() * 40 - 20 : 0),
                    1, 0, 5,
                    inUlt ? 35 : 25,
                    bleeds ? 10 : 0,
                    inUlt ? 15 : 0,
                );
            }
        }),

        new Ability(EAbilityType.ACTIVE, [18], new ActiveAbilityData(12), EMPTY_METHOD),

        new Ability(EAbilityType.ACTIVE, [13], new ActiveAbilityData(8), function(n: number, player: Player){

            player.addEffect(EFFECT.ACCELERATE, 8, {multiplier: 1.45});

        }),

        new Ability(EAbilityType.ACTIVE, [60], new ActiveAbilityData(25), EMPTY_METHOD)

    ]

)