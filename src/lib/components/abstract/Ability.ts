import EAbilityType from "../../enums/EAbilityType";
import Player from "../Player";
import Projectile from "../Projectile";
import {AbilityData} from "../sub/AbilityData";

export default abstract class Ability {

    abstract type: EAbilityType;
    abstract maxCooldown: number[];
    abstract data: AbilityData;

    activeTimeout: NodeJS.Timeout | undefined;
    cooldownTimeout: NodeJS.Timeout | undefined;
    cannotCast: boolean = false;

    player: Player;
    createdProjectile?: Projectile;

    ultimate: boolean = false;

    abstract onCast(n: number): void;

    constructor(player: Player) {
        this.player = player;
        this.cannotCast = false;
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

    cast(n: number){

        if (this.cannotCast) return false;
        if (this.ultimate && this.player.ultimateCharge < this.player.maxUltimateCharge
        && !(this.type == EAbilityType.ACTIVECHARGES && this.data.active)) return false;

        switch(this.type){
            
            case EAbilityType.ONETIME: //one time
            {
                if (this.ultimate) this.player.ultimateCharge = 0;
                this.onCast(n);
                this.cannotCast = true
                setTimeout(()=>{
                    this.cannotCast = false;
                }, this.maxCooldown[n] * 1000);
                return true;
            }

            case EAbilityType.ACTIVE: //Active
            {
                if (!this.data.active) {
                    if (this.ultimate) this.player.ultimateCharge = 0;
                    this.onCast(n);
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

            case EAbilityType.CHARGES: //! Cannot Be an ULTIMATE
            {
                if (this.data.charges > 1) {

                    this.onCast(n);
                    this.data.charges -= 1;
                    this.cannotCast = true;
                    clearTimeout(this.cooldownTimeout);
                    this.cooldownTimeout = setTimeout(()=>{
                        this.cannotCast = false;
                    }, this.data.cooldownCharge * 1000);
                    if (this.data.recharger == undefined) {
                        let recharge = () => {
                            this.data.charges += 1;
                            if (this.data.charges < this.data.maxCharges){
                                this.data.recharger = setTimeout(recharge, this.data.chargeTime * 1000);
                            } else this.data.recharger = undefined;
                        }
                        this.data.recharger = setTimeout(recharge, this.data.chargeTime * 1000);
                    }
                    return true;

                } else if (this.data.charges == 1) {

                    this.onCast(n);
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

                    if (this.ultimate) this.player.ultimateCharge = 0;
                    this.onCast(n);
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

                    this.onCast(n);
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

