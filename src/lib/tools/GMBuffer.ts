import EBufferType from "../enums/EBufferType";

export default class GMBuffer {

    private buffer: Buffer;
    private index: number = 0;
    private data: Array<[any, EBufferType]> = [];

    static allocate(size: number){
        let b = new GMBuffer();
        b.buffer = Buffer.alloc(size);
        b.seek(0);
        return b;

    }

    static from(buff: Buffer){
        let b = new GMBuffer();
        b.buffer = buff;
        b.seek(0);
        return b;
    }

    private constructor(){}

    copy() {
        return GMBuffer.from(this.getBuffer());
    }

    write(value: any, type: EBufferType){

        switch(type){

            case EBufferType.UInt8: {
                this.buffer.writeUInt8(value, this.index);
                this.index++;
                break;
            }
            case EBufferType.SInt8: {
                this.buffer.writeInt8(value, this.index);
                this.index++;
                break;
            }

            case EBufferType.UInt16: {
                this.buffer.writeUInt16LE(value, this.index);
                this.index+=2;
                break;
            }
            case EBufferType.SInt16: {
                this.buffer.writeInt16LE(value, this.index);
                this.index+=2;
                break;
            }
            
            case EBufferType.UInt32: {
                this.buffer.writeUInt32LE(value, this.index);
                this.index+=4;
                break;
            }
            case EBufferType.SInt32: {
                this.buffer.writeInt32LE(value, this.index);
                this.index+=4;
                break;
            }


            case EBufferType.Float32: {
                this.buffer.writeFloatLE(value, this.index);
                this.index+=4;
                break;
            }

            default: {
                throw new TypeError("No such buffer type.");
            }

        }

    }

    read(type: EBufferType){

        switch(type){

            case EBufferType.UInt8: {
                let value = this.buffer.readUInt8(this.index);
                this.index++;
                return value;
            }
            case EBufferType.SInt8: {
                let value = this.buffer.readInt8(this.index);
                this.index++;
                return value;
            }

            case EBufferType.UInt16: {
                let value = this.buffer.readUInt16LE(this.index);
                this.index+=2;
                return value;
            }
            case EBufferType.SInt16: {
                let value = this.buffer.readInt16LE(this.index);
                this.index+=2;
                return value;
            }
            
            case EBufferType.UInt32: {
                let value = this.buffer.readUInt32LE(this.index);
                this.index+=4;
                return value;
            }
            case EBufferType.SInt32: {
                let value = this.buffer.readInt32LE(this.index);
                this.index+=4;
                return value;
            }


            case EBufferType.Float32: {
                let value = this.buffer.readFloatLE(this.index);
                this.index+=4;
                return value;
            }

            default: {
                throw new TypeError("No such buffer type.");
            }

        }

    }

    seek(index: number){
        this.index = index;
    }

    tell(){
        return this.index;
    }

    peek(type: EBufferType, index: number){
        let lastIndex = this.index;
        this.seek(index);
        let val = this.read(type);
        this.index = lastIndex;
        return val;
    }

    poke(value: any, type: EBufferType, index: number){
        let lastIndex = this.index;
        this.seek(index);
        this.write(value, type);
        this.index = lastIndex;
    }

    getBuffer() {
        return this.buffer;
    }

}