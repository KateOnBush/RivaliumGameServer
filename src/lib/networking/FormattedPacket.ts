import EBufferType from "../enums/EBufferType";
import EPacketChannel from "../enums/EPacketChannel";
import GMBuffer from "../tools/GMBuffer";
import FormattedPacketAttributeList from "./attributes/FormattedPacketAttributeList";

export abstract class FormattedPacket {

    static attributes: FormattedPacketAttributeList;
    abstract channel: EPacketChannel;
    abstract index: number;
    [key: string]: any;

    size() {
        const attributes = (this.constructor as typeof FormattedPacket).attributes;
        let s = 0, booleanStreak = 0;
        for(const attribute of attributes) {
            if (!attribute.boolean) {
                booleanStreak = 0;
                s += attribute.type >> 4;
                continue;
            }
            if (booleanStreak == 0) s+=1;
            if (booleanStreak == 8) { booleanStreak = 0; s+=1; }
            booleanStreak++;
        }
        return s;
    }

    bake(accumulator = 0x0): GMBuffer {
        const attributes = (this.constructor as typeof FormattedPacket).attributes;
        let size = this.size(), fullSize = size + (this.channel == EPacketChannel.UDP ? 5 : 2);
        // ! UDP: Length<Data>(1 byte) + Accumulator(1 byte) + Index(1 byte) + Data + Checksum<Data>(2 byte)
        // * Checksum = ConsecutiveXOR(1 byte) + Sum(1 byte)
        // ! TCP: Length<Data>(1 byte) + Index(1 byte) + Data
        let buff = GMBuffer.allocate(fullSize);
        buff.write(size, EBufferType.UInt8);
        if (this.channel == EPacketChannel.UDP) buff.write(accumulator, EBufferType.UInt8); //Writing the accumulator
        buff.write(this.index, EBufferType.UInt8);
        let booleanStreak = 0, builtBoolean = 0;
        let checksum = 0, returnedChecksum = 0;
        for(const attribute of attributes) {
            let value = this[attribute.name] ?? 0;
            if (!attribute.boolean) {
                if (booleanStreak != 0) returnedChecksum = buff.write(builtBoolean, EBufferType.UInt8);
                checksum = ((returnedChecksum ^ checksum) & 0xFF00) | ((returnedChecksum + checksum) & 0xFF);
                if (attribute.multiplier == 1) returnedChecksum = buff.write(value, attribute.type);
                else returnedChecksum = buff.write(Math.round(value * attribute.multiplier), attribute.type);
                checksum = ((returnedChecksum ^ checksum) & 0xFF00) | ((returnedChecksum + checksum) & 0xFF);
                booleanStreak = 0;
                continue;
            }
            builtBoolean |= ((value & 1) << booleanStreak++);
            if (booleanStreak == 8) {
                returnedChecksum = buff.write(builtBoolean, EBufferType.UInt8);
                checksum = ((returnedChecksum ^ checksum) & 0xFF00) | ((returnedChecksum + checksum) & 0xFF);
                booleanStreak = 0;
            }
        }
        if (this.channel == EPacketChannel.UDP) buff.write(checksum & 0xFFFF, EBufferType.UInt16);
        return buff;
    }

    static from(channel: EPacketChannel, buffer: GMBuffer) {

    }

}