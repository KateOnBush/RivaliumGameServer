import EAbilityType from "../enums/EAbilityType";
import Player from "./Player";
import Projectile from "./Projectile";
import {AbilityData} from "./sub/AbilityData";

export default class Ability {

    type: EAbilityType;
    maxCooldown: number[];
    cannotCast: boolean;
    data: AbilityData;
    castMethod: (n: number, p: Player, a: Ability) => void;
    activeTimeout: NodeJS.Timeout | undefined;
    cooldownTimeout: NodeJS.Timeout | undefined;

    createdProjectile?: Projectile;

    constructor(type: EAbilityType, cooldowns: number[], abilitydata: AbilityData, castMethod: (n: number, p: Player, a: Ability) => void){
        
        this.type = type;
        this.maxCooldown = cooldowns;
        this.cannotCast = false;
        this.data = abilitydata;
        this.castMethod = castMethod;
        this.activeTimeout = undefined;
        this.cooldownTimeout = undefined;
    }

    forceCooldown(n = 0){

        clearTimeout(this.activeTimeout);
        clearTimeout(this.cooldownTimeout);
        if (this.data){
            this.data.active = false;
            this.data.charges = this.data.maxCharges;
        }
        this.cannotCast = true;
        this.cooldownTimeout = setTimeout(()=>{
            this.cannotCast = false;
        }, this.maxCooldown[n] * 1000);

    }

    cast(n: number, player: Player){

        if (this.cannotCast) return false;

        switch(this.type){
            
            case EAbilityType.ONETIME: //one time
            {
                this.castMethod(n, player, this);
                this.cannotCast = true
                setTimeout(()=>{
                    this.cannotCast = false;
                }, this.maxCooldown[n] * 1000);
                return true;
            }

            case EAbilityType.ACTIVE: //Active
            {
                if (!this.data.active) {
                    this.castMethod(n, player, this);
                    this.cannotCast = true;
                    this.data.active = true;
                    var activeTime = this.data.activeTime,
                        cooldown = this.maxCooldown[n];
                    clearTimeout(this.activeTimeout);
                    this.activeTimeout = setTimeout(()=>{
                        this.data.active = false;
                        clearTimeout(this.cooldownTimeout);
                        this.cooldownTimeout = setTimeout(() => { 
                            this.cannotCast = false;
                        }, cooldown * 1000);
                    }, activeTime * 1000);
                    return true;
                }
                break;
                
            }

            case EAbilityType.CHARGES: //Charges
            {
                if (this.data.charges > 1) {

                    this.castMethod(n, player, this);
                    this.data.charges -= 1;
                    this.cannotCast = true;
                    clearTimeout(this.cooldownTimeout);
                    this.cooldownTimeout = setTimeout(()=>{
                        this.cannotCast = false;
                    }, this.data.cooldownCharge * 1000);
                    if (this.data.recharger == undefined) {
                        var recharge = () => {
                            this.data.charges += 1;
                            if (this.data.charges < this.data.maxCharges){
                                this.data.recharger = setTimeout(recharge, this.data.chargeTime * 1000);
                            } else this.data.recharger = undefined;
                        }
                        this.data.recharger = setTimeout(recharge, this.data.chargeTime * 1000);
                    }
                    return true;

                } else if (this.data.charges == 1) {

                    this.castMethod(n, player, this);
                    this.data.charges = 0;
                    this.cannotCast = true;
                    if (this.data.recharger) clearTimeout(this.data.recharger);
                    clearTimeout(this.cooldownTimeout);
                    this.cooldownTimeout = setTimeout(()=>{
                        this.cannotCast = false;
                        this.data.charges += 1;
                    }, this.maxCooldown[n] * 1000);
                    return true;

                }
                break;
            }

            case EAbilityType.ACTIVECHARGES: //Active-charges
            {
                if (!this.data.active) {

                    this.castMethod(n, player, this);
                    this.data.active = true;
                    clearTimeout(this.activeTimeout);
                    this.activeTimeout = setTimeout(()=>{
                        this.data.active = false;
                        this.cannotCast = true;
                        clearTimeout(this.cooldownTimeout);
                        this.cooldownTimeout = setTimeout(()=>{
                            this.cannotCast = false;
                            this.data.charges = this.data.maxCharges;
                        }, this.maxCooldown[n] * 1000);
                    }, this.data.activeTime * 1000);
                    return true;

                } else if (this.data.charges > 0) {

                    this.castMethod(n, player, this);
                    this.data.charges -= 1;
                    this.cannotCast = true;
                    if (this.data.charges > 0) setTimeout(()=>{
                        this.cannotCast = false;
                    }, this.data.cooldownCharge * 1000);
                    else this.data.charges = this.data.maxCharges;
                    return true;

                }
                break;

            }
        }

        return false;
    }

}

