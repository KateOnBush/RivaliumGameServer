import EBufferType from "../enums/EBufferType";
import EPacketChannel from "../enums/EPacketChannel";
import GMBuffer from "../tools/GMBuffer";
import FormattedPacketAttributeList from "./attributes/FormattedPacketAttributeList";

export abstract class FormattedPacket {

    abstract attributes: FormattedPacketAttributeList;
    abstract channel: EPacketChannel;
    abstract index: number;
    [key: string]: any;

    size() {
        return this.attributes.reduce((acc: number, currentValue) => {
            return (acc + currentValue.type >> 4);
        }, 0);
    }

    bake(accumulator = 0x0): GMBuffer {
        let size = this.size() + (this.channel == EPacketChannel.UDP ? 3 : 2);
        // UDP: Length(1 byte) + Accumulator(1 byte) + Index(1 byte) + Data
        // TCP: Length(1 byte) + Index(1 byte) + Data
        let buff = GMBuffer.allocate(size);
        buff.write(size, EBufferType.UInt8);
        if (this.channel == EPacketChannel.UDP) buff.write(accumulator, EBufferType.UInt8); //Writing the accumulator
        buff.write(this.index, EBufferType.UInt8);
        for(const attribute of this.attributes) {
            let value = this[attribute.name] ?? 0;
            if (attribute.multiplier == 1) buff.write(value, attribute.type);
            else buff.write(Math.round(value * attribute.multiplier), attribute.type);
        }
        return buff;
    }

    static from(channel: EPacketChannel, buffer: GMBuffer) {

    }

}