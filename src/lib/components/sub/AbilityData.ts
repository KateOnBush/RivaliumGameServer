export class AbilityData {

    charges: number;
    maxCharges: number;
    activeTime: number;
    active: boolean = false;
    chargeTime: number;
    cooldownCharge: number;
    recharger?: NodeJS.Timeout = undefined;

    constructor(activeTime: number = 0, maxCharges: number = 0, chargeTime: number = 0, cooldownCharge: number = 0){
        this.charges = maxCharges;
        this.maxCharges = maxCharges;
        this.activeTime = activeTime;
        this.chargeTime = chargeTime;
        this.cooldownCharge = cooldownCharge;
    }

}

export class ActiveChargesAbilityData extends AbilityData {}
export class ActiveAbilityData extends AbilityData { 
    constructor(activeTime: number){ 
        super(activeTime); 
    } 
}
export class ChargesAbilityData extends AbilityData { 
    constructor(maxCharges : number, chargeTime: number, cooldownCharge: number){
        super(0, maxCharges, chargeTime, cooldownCharge)
    } 
}

export const NoAbilityData = new AbilityData(0, 0, 0, 0);