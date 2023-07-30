import {EMPTY_METHOD} from '../../Macros';
import Ability from "../../components/Ability";
import Character from "../../components/Character";
import {EFFECT} from "../../components/Player";
import {ActiveAbilityData, NoAbilityData} from "../../components/sub/AbilityData";
import EAbilityType from "../../enums/EAbilityType";
import Vector2 from '../../tools/vector/Vector2';
import EntityList from "../instancelist/EntityList";
import ExplosionList from "../instancelist/ExplosionList";
import ProjectileList from "../instancelist/ProjectileList";

export default Character.builder(
    "Masr",
    640,
    220,
    () => [
        new Ability(EAbilityType.ONETIME, [0], NoAbilityData, function(n, player){

            let isUlt = player.char.abilities[3].data.active;

            if (n == 0) {
                setTimeout(() => {
                    player.game?.addProjectile(player, ProjectileList.MasrBolt,
                        player.x, player.y, 80, player.mouseDirection, 1, 1, 10, 0, 0, 0, 1, EMPTY_METHOD, EMPTY_METHOD, 1, 0)
                }, 100);
            } else {

                if (isUlt) {

                    setTimeout(() => {

                        player.game?.addProjectile(player, ProjectileList.MasrBoltPowered,
                            player.x, player.y, 130, player.mouseDirection, 1, 0, 10, 0, 0, 0, 1, function (proj) {
                                if (proj.bounceCount > 4) proj.destroy();
                                player.game?.addExplosion(player, ExplosionList.MasrBolt, proj.x, proj.y, 150, 0);
                            }, EMPTY_METHOD, 1, 0).step(function (t, dt) {

                            if (Math.random() > 0.9) t.mov = Vector2.polar(t.mov.magnitude(), t.mov.direction() - 20 + Math.random() * 40);

                        })

                    }, 600)

                } else {

                    setTimeout(() => {

                        player.game?.addProjectile(player, ProjectileList.MasrBoltPowered,
                            player.x, player.y, 110, player.mouseDirection, 1, 1, 10, 0, 0, 0, 0, EMPTY_METHOD, function (proj) {
                                player.game?.addExplosion(player, ExplosionList.MasrBolt, proj.x, proj.y, 150, 0);
                            })

                    }, 600);

                }
            }
            

        }),
        new Ability(EAbilityType.ONETIME, [0], NoAbilityData, function(n, player){

            setTimeout(() => {
                var m = Math.sign(player.mouse.x - player.x);
                player.game?.addEntity(player, EntityList.MasrCloud, player.x + m * ((Math.abs(player.mx) * 4) + 60), player.y, 100, 1, 6, [m]);
            }, 100);

        }),
        new Ability(EAbilityType.ONETIME, [0], NoAbilityData, function(n, player){

            player.forceDash(player.mouseDirection, 0.22, 1.8);
            if (player.char.abilities[3].data.active) {
                player.addEffect(EFFECT.INVISIBILITY, 3);
            }
        
        }),
        new Ability(EAbilityType.ACTIVE, [10], new ActiveAbilityData(20), EMPTY_METHOD)

    ]

);