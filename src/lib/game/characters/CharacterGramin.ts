import Lag from "../../tools/Lag";
import Ability from "../../components/Ability";
import { ABILITY_TYPE } from "../../enums/EAbilityType";
import Character from "../../components/Character";
import { ActiveChargesAbilityData, NoAbilityData } from "../../components/sub/AbilityData";
import { EMPTY_METHOD } from "../../../constants";
import GM from "../../tools/GMLib";


export default Character.builder(

    "Gramin",
    480,
    220,

    [
        new Ability(ABILITY_TYPE.ONETIME, [0.25, 1.8], NoAbilityData, function(n, player){
            var shootFunc = ()=>{
                if (!player.game) return;
                var pred = Lag.predictNextPosition(player);
                var proj = player.char.abilities[3].data.active ? 3 : 2;
                var d = player.mouseDirection,
                    _x = GM.lengthdir_x(6, d),
                    _y = GM.lengthdir_y(6, d);
                player.game.addProjectile(
                    player,
                    proj,
                    pred.pos.x + _x,
                    pred.pos.x + _y - 10,
                    80, d + GM.random_range(-5, 5), 
                    1, 1, 10, 50, 20, 0
                )
            }
            shootFunc();
            if (n == 1) [.1, .2, .25, .3, .35, .4].forEach(time=>{
                setTimeout(shootFunc, time * 1000)
            })
        }),

        new Ability(ABILITY_TYPE.ONETIME, [1.5], NoAbilityData, function(n, player){
            var pred = Lag.predictNextPosition(player);
            var _d = player.mouseDirection+GM.random_range(-2,2);

            var __spd = GM.point_distance(0,0, GM.lengthdir_x(25, _d)+player.mov.x/3, GM.lengthdir_y(25, _d)+player.mov.y/3);
            var __d = GM.point_direction(0,0, GM.lengthdir_x(25, _d)+player.mov.x/3, GM.lengthdir_y(25, _d)+player.mov.y/3);
            player.game?.addProjectile(
                player,
                4,
                pred.pos.x,
                pred.pos.y - 10,
                __spd, __d,     
                1, 0, 1, 50, 20, 0, 1,
                EMPTY_METHOD,
                function(thisProj){
                    player.game?.addExplosion(player,
                        0, thisProj.x, thisProj.y,
                        200, 100
                    )
                }
            )
        }),

        new Ability(ABILITY_TYPE.ONETIME, [5], NoAbilityData, function(n, player){

            player.heal(40, 3);

        }),

        
        new Ability(ABILITY_TYPE.ACTIVECHARGES, [.2], new ActiveChargesAbilityData(20, 30, 0, .1), function(n, player, ability){
            if (!ability.data.active) return;
            var _d = player.mouseDirection + GM.random_range(-2,2);
            var _x = GM.lengthdir_x(20, _d);
            var _y = GM.lengthdir_y(20, _d);
            setTimeout(function(){
                var pred = Lag.predictNextPosition(player);
                player.game?.addProjectile(player,
                    5,
                    pred.pos.x + _x,
                    pred.pos.y + _y - 10,
                    60, _d,     
                    1, 1, 10, 20, 0, 0, 0,
                    EMPTY_METHOD,
                    function(thisProj){
                        player.game?.addExplosion(player,
                            1, thisProj.x, thisProj.y,
                            250, 30
                        )
                        for(var i of new Array(4)){
                            player.game?.addProjectile(player,
                                6,
                                thisProj.x - GM.lengthdir_x(30, thisProj.direction),
                                thisProj.y - GM.lengthdir_y(30, thisProj.direction),
                                8, GM.random_range(0, 360),
                                1, 0, 1, 20, 0, 0, 1,
                                EMPTY_METHOD, 
                                function(p){
                                    player.game?.addExplosion(player,
                                        0, p.x, p.y,
                                        100, 30
                                    )
                                }
                                
                            )
                        }
                    }
                )
            }, 100);

        })
    ]

)