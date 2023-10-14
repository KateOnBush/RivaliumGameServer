import EBufferType from "../enums/EBufferType";
import EPacketChannel from "../enums/EPacketChannel";
import GMBuffer from "../tools/GMBuffer";

export abstract class FormattedPacket {

    abstract data: Array<[string, EBufferType]>;
    abstract channel: EPacketChannel;
    abstract index: number;
    [key: string]: any

    static UDPIndex: number = 0x0;

    size() {
        return this.data.reduce((acc: number, currentValue) => {
            return (acc + currentValue[1] >> 4);
        }, 0);
    }

    bake(accumulator = 0x0): GMBuffer {
        let size = this.size() + (this.channel == EPacketChannel.UDP ? 3 : 2);
        // UDP: Length(1 byte) + Accumulator(1 byte) + Index(1 byte) + Data
        // TCP: Length(1 byte) + Index(1 byte) + Data
        let buff = GMBuffer.allocate(size);
        buff.write(size, EBufferType.UInt8);
        buff.write(accumulator, EBufferType.UInt8);
        buff.write(this.index, EBufferType.UInt8);
        for(const [key, type] of this.data) {
            let value = this[key] ?? 0;
            buff.write(value, type);
        }
        return buff;
    }

    static from(channel: EPacketChannel, buffer: GMBuffer) {

    }

}