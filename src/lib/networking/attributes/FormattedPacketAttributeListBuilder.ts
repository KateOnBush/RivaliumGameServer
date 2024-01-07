import FormattedPacketAttributeList from "./FormattedPacketAttributeList";
import EBufferType from "../../enums/EBufferType";
import FormattedPacketAttribute from "./FormattedPacketAttribute";

export default class FormattedPacketAttributeListBuilder {

    data: FormattedPacketAttributeList = [];

    add(name: string, type: EBufferType = EBufferType.UInt8, multiplier: number = 1) {
        this.data.push(new FormattedPacketAttribute(name, type, multiplier));
        return this;
    }

    asBoolean() {
        this.data[this.data.length - 1].boolean = true;
        return this;
    }

    build() {
        return this.data;
    }

}