import EBufferType from "../../enums/EBufferType";

export default class FormattedPacketAttribute {

    name: string;
    type: EBufferType;
    multiplier: number;

    constructor(name: string, type: EBufferType, multiplier: number) {
        this.name = name;
        this.type = type;
        this.multiplier = multiplier;
    }

}