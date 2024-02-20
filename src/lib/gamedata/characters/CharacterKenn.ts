import Lag from "../../tools/Lag";
import Ability from "../../components/Ability";
import EAbilityType from "../../enums/EAbilityType";
import Character from "../../components/Character";
import Player, {PlayerEffect} from "../../components/Player";
import {ActiveAbilityData, NoAbilityData} from "../../components/sub/AbilityData";
import {EMPTY_METHOD} from "../../Macros";
import ProjectileList from "../instancelist/ProjectileList";
import Time from "../../tools/Time";
import GM from "../../tools/GMLib";

export default Character.builder(

    "Kenn",
    550,
    220,

    () => [

        new Ability(EAbilityType.ONETIME, [0.5, 1.5], NoAbilityData, function (n: number, player: Player) {
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

        new Ability(EAbilityType.ACTIVE, [10], new ActiveAbilityData(8), function(n: number, player: Player){

            player.addEffect(PlayerEffect.SWIFTNESS, 8, {multiplier: 1.25});

        }),

        new Ability(EAbilityType.ONETIME, [13], NoAbilityData, async function(n: number, player: Player) {
            player.addEffect(PlayerEffect.PROTECTION, 1);
            await Time.wait(1000);
            const delays = new Array(10);
            let inUlt = player.char.abilities[3].data.active;
            let bleeds = player.char.abilities[1].data.active;
            let projectile = inUlt ? ProjectileList.KennDaggerTransformed : ProjectileList.KennDagger;
            for(const time of delays) {
                const pred = Lag.predictNextPosition(player);
                player.game.addProjectile(
                    player,
                    projectile,
                    pred.pos.x,
                    pred.pos.y,
                    70,
                    player.mouseDirection,
                    1, 0, 5,
                    inUlt ? 35 : 25,
                    bleeds ? 10 : 0,
                    inUlt ? 15 : 0,
                );
                player.game.addProjectile(
                    player,
                    projectile,
                    pred.pos.x,
                    pred.pos.y,
                    70,
                    GM.point_direction(0, 0, player.x - player.mouse.x , player.mouse.y - player.y),
                    1, 0, 5,
                    inUlt ? 35 : 25,
                    bleeds ? 10 : 0,
                    inUlt ? 15 : 0,
                );
                await Time.wait(0.2 * 1000);
            }
        }),

        new Ability(EAbilityType.ACTIVE, [60], new ActiveAbilityData(25), EMPTY_METHOD)

    ]

)