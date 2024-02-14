import EBufferType from "../enums/EBufferType";
import EPacketChannel from "../enums/EPacketChannel";
import GMBuffer from "../tools/GMBuffer";
import FormattedPacketAttributeList from "./attributes/FormattedPacketAttributeList";

export abstract class FormattedPacket {

    static attributes: FormattedPacketAttributeList = [];
    static channel: EPacketChannel;
    static index: number;
    [key: string]: any;

    static __cached_size: number | undefined = undefined;

    size() {
        let staticClass = (this.constructor as typeof FormattedPacket);
        if (staticClass.__cached_size) return staticClass.__cached_size;
        const attributes = staticClass.attributes;
        let size = 0, booleanStreak = 0;
        for(const attribute of attributes) {
            if (!attribute.boolean) {
                booleanStreak = 0;
                size += attribute.type >> 4;
                continue;
            }
            if (booleanStreak == 0) size+=1;
            if (booleanStreak == 8) { booleanStreak = 0; size+=1; }
            booleanStreak++;
        }
        staticClass.__cached_size = size;
        return size;
    }

    bake(): GMBuffer {
        const constructor = (this.constructor as typeof FormattedPacket);
        const attributes = constructor.attributes;
        const channel = constructor.channel, index = constructor.index;
        let size = this.size(), fullSize = size + (channel == EPacketChannel.UDP ? 4 : 2);
        // ! UDP: Index(1 byte) + Length<Data>(1 byte) + Data + Checksum<Data>(2 byte)
        // * Checksum = ConsecutiveXOR(1 byte) + Sum(1 byte)
        // ! TCP: Index(1 byte) + Length<Data>(1 byte) + Data
        let buff = GMBuffer.allocate(fullSize);
        buff.write(index, EBufferType.UInt8);
        buff.write(size, EBufferType.UInt8);
        let booleanStreak = 0, builtBoolean = 0;
        let checksum = 0, returnedChecksum = 0, currentIndex = 0;
        for(const attribute of attributes) {
            let value = this[attribute.name] ?? 0;
            if (!attribute.boolean) {
                if (booleanStreak != 0) {
                    returnedChecksum = buff.write(builtBoolean, EBufferType.UInt8);
                    checksum = ((returnedChecksum ^ checksum) & 0xFF00) | ((returnedChecksum + checksum) & 0xFF);
                }
                if (attribute.multiplier == 1) returnedChecksum = buff.write(value, attribute.type);
                else returnedChecksum = buff.write(Math.round(value * attribute.multiplier), attribute.type);
                checksum = ((returnedChecksum ^ checksum) & 0xFF00) | ((returnedChecksum + checksum) & 0xFF);
                booleanStreak = 0;
                currentIndex++;
                continue;
            }
            builtBoolean |= ((value & 1) << booleanStreak++);
            if (booleanStreak == 8 || currentIndex == attributes.length - 1) {
                returnedChecksum = buff.write(builtBoolean, EBufferType.UInt8);
                checksum = ((returnedChecksum ^ checksum) & 0xFF00) | ((returnedChecksum + checksum) & 0xFF);
                booleanStreak = 0;
            }
            currentIndex++;
        }
        if (channel == EPacketChannel.UDP) buff.write(checksum & 0xFFFF, EBufferType.UInt16);
        return buff;
    }

}