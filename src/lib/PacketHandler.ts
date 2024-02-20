import GMBuffer from "./tools/GMBuffer";
import {readdirSync, statSync} from "fs";
import {join, resolve} from "path";
import Logger from "./tools/Logger";
import Time from "./tools/Time";
import {FormattedPacket} from "./networking/FormattedPacket";
import {TCPServerRequest} from "./enums/TCPPacketTypes";
import {UDPServerRequest} from "./enums/UDPPacketTypes";
import EPacketChannel from "./enums/EPacketChannel";
import EBufferType from "./enums/EBufferType";
import TCPIncomingPacket from "./networking/tcp/TCPIncomingPacket";
import UDPIncomingPacket from "./networking/udp/UDPIncomingPacket";
import IncomingPacket from "./networking/IncomingPacket";
import UDPPlayerSocket from "./networking/udp/UDPPlayerSocket";
import TCPPlayerSocket from "./networking/tcp/TCPPlayerSocket";

export default class PacketHandler {

    static TCPPacketMap = new Map<TCPServerRequest, IncomingPacket>();
    static UDPPacketMap = new Map<UDPServerRequest, IncomingPacket>();

    static async registerClasses(directory: string) {
        const files = readdirSync(directory);

        Logger.info("Fetching directory...", directory);
        await Time.wait(50);
        for (const file of files) {
            const filePath = join(directory, file);
            const fileStats = statSync(filePath);

            if (fileStats.isDirectory()) {
                Logger.info("Reading directory {}...", file);
                await this.registerClasses(filePath);
                Logger.clearLine();
            } else if (fileStats.isFile() && (file.endsWith('.ts') || file.endsWith('.js'))) {
                const eventModule = require(resolve(filePath));
                for (const key of Object.keys(eventModule)) {
                    const eventClass = eventModule[key];
                    if (eventClass.prototype instanceof FormattedPacket) {
                        let packetType = eventClass as IncomingPacket;
                        Logger.clearLine();
                        Logger.info("Registering packet {}, channel {}",
                            packetType.channel == EPacketChannel.UDP ? UDPServerRequest[packetType.index] : TCPServerRequest[packetType.index],
                            EPacketChannel[packetType.channel]);
                        this.registerEvent(packetType.channel, packetType.index, packetType);
                        await Time.wait(50);
                    }
                }
            }
        }
        Logger.clearLine();
    }

    static registerEvent(channel: EPacketChannel, index: UDPServerRequest | TCPServerRequest, eventClass: IncomingPacket) {

        (channel == EPacketChannel.UDP ?
            this.UDPPacketMap :
            this.TCPPacketMap)
            .set(index as (UDPServerRequest & TCPServerRequest), eventClass);
    }


    static handleTCP(buffer: GMBuffer, socket: TCPPlayerSocket) {
        buffer.seek(0);
        if (buffer.size() == 0) Logger.warn("Empty packet.");
        while(true) {
            if (buffer.tell() == buffer.size()) break;
            const index = buffer.read(EBufferType.UInt8) as TCPServerRequest;
            Logger.info("Received {}", TCPServerRequest[index]);
            if (!socket.identified && index != TCPServerRequest.IDENTIFY) {
                Logger.warn("Unidentified sender with non-identify packet on TCP channel.");
                return;
            }
            let packetType = this.TCPPacketMap.get(index);
            let packetLength = buffer.read(EBufferType.UInt8);
            if (buffer.tell() + packetLength > buffer.size()) {
                Logger.warn("Invalid TCP packet received with index {}[{}]", index, TCPServerRequest[index]);
                return;
            }
            if (!packetType) {
                buffer.seek(buffer.tell() + packetLength);
                Logger.warn("Unknown TCP packet index received: {}", index);
                continue;
            }
            let constructedPacket = new packetType() as TCPIncomingPacket;
            if (packetLength != constructedPacket.size()) {
                Logger.warn("Packet length doesn't correspond to packet type length.");
                return;
            }
            const attributes = packetType.attributes;
            let booleanStreak = 0, readBoolean = 0;
            for(const attribute of attributes) {
                if (attribute.boolean) {
                    if (booleanStreak == 0) {
                        readBoolean = buffer.read(EBufferType.UInt8);
                    }
                    constructedPacket[attribute.name] = (readBoolean >> booleanStreak) & 1;
                    booleanStreak++;
                    if (booleanStreak >= 8) booleanStreak = 0;
                    continue;
                }
                booleanStreak = 0;
                constructedPacket[attribute.name] = buffer.read(attribute.type) / attribute.multiplier;
            }
            constructedPacket.handle(socket);
        }
    }

    static handleUDP(buffer: GMBuffer, socket: UDPPlayerSocket) {

        buffer.seek(0);
        if (buffer.size() < 2) return Logger.warn("Empty packet.");
        // ! UDP: Index(1 byte) + Length<Data>(1 byte) + Data + Checksum<Data>(2 byte)
        // * Checksum = ConsecutiveXOR(1 byte) + Sum(1 byte)
        const index = buffer.read(EBufferType.UInt8) as UDPServerRequest;
        if (!socket.identified && index != UDPServerRequest.IDENTIFY) return Logger.warn("Unidentified sender with non-identify packet on UDP channel.");
        const length = buffer.read(EBufferType.UInt8);
        if (buffer.size() != (length + 4)) return Logger.warn("Invalid UDP packet, inaccurate length."); //!Corrupted
        let packetType = this.UDPPacketMap.get(index);
        if (!packetType) return Logger.warn("Invalid UDP packet, invalid index."); //!Corrupted
        let constructedPacket = new packetType() as UDPIncomingPacket;
        if (buffer.size() != (constructedPacket.size() + 4)) return Logger.warn("Invalid UDP packet, invalid length. {} and {}, index {}", buffer.size(), constructedPacket.size() + 4, UDPServerRequest[index]); //!Corrupted
        const attributes = packetType.attributes;
        let checksum = 0, consecutiveXOR = 0;
        let booleanStreak = 0, readBoolean = 0;
        for(const attribute of attributes) {
            if (attribute.boolean) {
                if (booleanStreak == 0) {
                    readBoolean = buffer.read(EBufferType.UInt8);
                    let valueToCount = readBoolean;
                    consecutiveXOR ^= readBoolean;
                    while(valueToCount > 0) {
                        checksum += valueToCount & 1;
                        valueToCount >>= 1;
                    }
                }
                constructedPacket[attribute.name] = (readBoolean >> booleanStreak) & 1;
                booleanStreak++;
                if (booleanStreak >= 8) booleanStreak = 0;
                continue;
            }
            booleanStreak = 0;
            let valueRead = buffer.read(attribute.type), valueSizeInBytes = attribute.type >> 4;
            while(valueSizeInBytes > 0) {
                let integer = buffer.peek(EBufferType.UInt8, buffer.tell() - valueSizeInBytes);
                consecutiveXOR ^= integer;
                while(integer > 0) {
                    checksum += integer & 1;
                    integer >>= 1;
                }
                valueSizeInBytes--;
            }
            constructedPacket[attribute.name] = valueRead / attribute.multiplier;
        }
        checksum = checksum % 0xFF;
        let readXOR = buffer.read(EBufferType.UInt8);
        let readChecksum = buffer.read(EBufferType.UInt8);
        if (readChecksum != checksum || readXOR != consecutiveXOR) {
            return Logger.warn("Invalid checksum. Sum: {} vs {}, XOR: {} vs {}",
                readChecksum, checksum,
                readXOR.toString(2), consecutiveXOR.toString(2));
        }
        constructedPacket.handle(socket);
    }

}