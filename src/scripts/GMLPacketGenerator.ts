import {readdirSync, statSync} from "fs";
import Logger from "../lib/tools/Logger";
import path, {join, resolve} from "path";
import {FormattedPacket} from "../lib/networking/FormattedPacket";
import EPacketChannel from "../lib/enums/EPacketChannel";
import EBufferType from "../lib/enums/EBufferType";
import {UDPServerRequest, UDPServerResponse} from "../lib/enums/UDPPacketTypes";
import UDPPacket from "../lib/networking/udp/UDPPacket";
import UDPIncomingPacket from "../lib/networking/udp/UDPIncomingPacket";
import {TCPServerRequest, TCPServerResponse} from "../lib/enums/TCPPacketTypes";
import TCPIncomingPacket from "../lib/networking/tcp/TCPIncomingPacket";
import UResPlayerFlip from "../lib/networking/udp/response/UResPlayerFlip";
import * as fs from "fs";
import TCPPacket from "../lib/networking/tcp/TCPPacket";

async function GMLPacketGenerator() {

    let bufferTypeMap = new Map<EBufferType, String>();
    bufferTypeMap.set(EBufferType.UInt8, "buffer_u8");
    bufferTypeMap.set(EBufferType.UInt16, "buffer_u16");
    bufferTypeMap.set(EBufferType.UInt32, "buffer_u32");
    bufferTypeMap.set(EBufferType.SInt8, "buffer_s8");
    bufferTypeMap.set(EBufferType.SInt16, "buffer_s16");
    bufferTypeMap.set(EBufferType.SInt32, "buffer_s32");
    bufferTypeMap.set(EBufferType.Float32, "buffer_f32");

    async function createFile(type: typeof FormattedPacket) {

        let channel = type.channel == EPacketChannel.UDP ? "NetworkingChannel.UDP" : "NetworkingChannel.TCP";
        let correctEnum: string, correctIndex: string;
        if (type.prototype instanceof UDPPacket) {
            correctEnum = "UDPServerResponse";
            correctIndex = UDPServerResponse[type.index]
            if (type.prototype instanceof UDPIncomingPacket) {
                correctEnum = "UDPServerRequest";
                correctIndex = UDPServerRequest[type.index]
            }
        } else {
            correctEnum = "TCPServerResponse";
            correctIndex = TCPServerResponse[type.index]
            if (type.prototype instanceof TCPIncomingPacket) {
                correctEnum = "TCPServerRequest";
                correctIndex = TCPServerRequest[type.index]
            }
        }
        let attributes = type.attributes.map(attribute => {
            return `\t\t.add(\"${attribute.name}\", ${bufferTypeMap.get(attribute.type)}${attribute.multiplier != 1 ? ", " + attribute.multiplier : ""})${attribute.boolean ? ".asBoolean()" : ""}`;
        }).join("\n");
        let fullAttributes = "\tstatic attributes = new PacketAttributeListBuilder()\n" + attributes + "\n\t\t.build();";
        let fullVariables = type.attributes.map(attribute => {
            return "\t" + attribute.name + " = 0;";
        }).join("\n");

        /*let content = `function ${type.name}(): NetworkingPacket(${channel}, ${correctEnum}.${correctIndex}) constructor{\n\n${fullAttributes}\n\n${fullVariables}\n\n}`;
        let filePath = path.dirname(__filename) + "../../../generated/gml/" + type.name + ".gml";
        await fs.promises.writeFile(filePath, content);*/

        if (!(type.prototype instanceof UDPIncomingPacket) && type.prototype instanceof UDPPacket)
            console.log(`\t\tcase ${correctEnum}.${correctIndex}:\n\t\t\tconstructedPacket = new ${type.name}();\n\t\t\tbreak;`);

    }

    async function registerClasses(directory: string) {
        const files = readdirSync(directory);
        for (const file of files) {
            const filePath = join(directory, file);
            const fileStats = statSync(filePath);
            if (fileStats.isDirectory()) {
                await registerClasses(filePath);
            } else if (fileStats.isFile() && (file.endsWith('.ts') || file.endsWith('.js'))) {
                const eventModule = require(resolve(filePath));
                for (const key of Object.keys(eventModule)) {
                    const eventClass = eventModule[key];
                    if (eventClass.prototype instanceof FormattedPacket) {
                        await createFile(eventClass);
                    }
                }
            }
        }
    }

    await registerClasses(path.dirname(__filename) + "/../lib/networking/")

}

export default GMLPacketGenerator;