import Lag from "../../tools/Lag";
import Logger from "../../tools/Logger";
import Ability from "../../components/Ability";
import EAbilityType from "../../enums/EAbilityType";
import Character from "../../components/Character";
import { ActiveAbilityData, ActiveChargesAbilityData, NoAbilityData } from '../../components/sub/AbilityData';
import { EMPTY_METHOD } from "../../Macros";
import GM from "../../tools/GMLib";
import ProjectileList from "../instancelist/ProjectileList";
import ExplosionList from "../instancelist/ExplosionList";
import Entity from "../../components/Entity";
import EntityList from "../instancelist/EntityList";


export default Character.builder(

    "Lenya",
    640,
    220,

    () => [
    
        new Ability(EAbilityType.ONETIME, [0.1, 0.1], NoAbilityData, function(n, player){

            if (!player.game) return;
            var pred = Lag.predictNextPosition(player);
            var proj = n == 0 ? ProjectileList.LenyaBlueBullet : ProjectileList.LenyaRedBullet;
            player.game.addProjectile(player,
                proj,
                pred.pos.x, pred.pos.y,
                140, player.mouseDirection,
                1, 0, 5, 
                n == 0 ? 5 : 25, 0, n == 0 ? 25 : 5
            );

        }),

        new Ability(EAbilityType.ONETIME, [.3], NoAbilityData, function(n, player){

            if (!player.game) return;
            var x = player.x, y = player.y, movvec = player.mov, mousex = player.mouse.x;
            var createdx = x + (Math.sign(mousex - x) == Math.sign(movvec.x) ? 16*movvec.x : Math.sign(mousex - x)*60),
			    createdy = y + 100;
            let d = player.mouseDirection;
            player.game.addEntity(
                player,
                0,
                createdx, createdy,
                100, .1,
                10,
                [d, d, d, d]
            )

        }),

        new Ability(EAbilityType.ACTIVECHARGES, [.1], new ActiveChargesAbilityData(5, 1, 0, 0), function(n, player, ability){

            if (ability.data.active){

                if (ability.createdProjectile) ability.createdProjectile.destroy();

            } else {

                if (!player.game) return;
                var pred = Lag.predictNextPosition(player);
                var _d = player.mouseDirection+GM.random_range(-2,2);

                var __spd = GM.point_distance(0,0, GM.lengthdir_x(25, _d)+player.mx/3, GM.lengthdir_y(25, _d)+player.my/3);
                var __d = GM.point_direction(0,0, GM.lengthdir_x(25, _d)+player.mx/3, GM.lengthdir_y(25, _d)+player.my/3);
                var proj = ProjectileList.LenyaGrenade;
                ability.createdProjectile = player.game.addProjectile(player,
                    proj,
                    pred.pos.x, pred.pos.y,
                    __spd, __d,
                    1, 0, 5, 
                    0, 0, 0, 1, EMPTY_METHOD, function(tProj){
                        ability.forceCooldown();
                        player.game?.addExplosion(player,
                            ExplosionList.LenyaGrenade,
                            tProj.x, tProj.y,
                            160, 20
                        )
                    }
                );

            }

        }),

        new Ability(EAbilityType.ONETIME, [5], NoAbilityData, function(n, player){

            setTimeout(()=>{

                player.game?.addEntity(player, 
                EntityList.LenyaUltimateRadius, 
                player.x, player.y, 0, 0, 10,
                [2200, 0.01]).step((entity, dt)=>{
                    entity.radius = GM.dtlerp(entity.radius ?? 0, entity.parameters[0], entity.parameters[1], dt);
                });

            }, 10/3 * 1000 * .5 | 0)

        })

    ]

)