import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import {UDPServerRequest} from "../../../enums/UDPPacketTypes";
import Player from "../../../components/Player";
import GMBuffer from "../../../tools/GMBuffer";
import {dataSize} from "../../../Macros";
import {TCPServerResponse} from "../../../enums/TCPPacketTypes";
import EBufferType from "../../../enums/EBufferType";
import UResPlayerGrapple from "../response/UResPlayerGrapple";
import UResPing from "../response/UResPing";
import UDPIncomingPacket from "../UDPIncomingPacket";
import UDPPlayerSocket from "../UDPPlayerSocket";

export default class UReqPing extends UDPIncomingPacket {

    static override attributes = [];
    static override index = UDPServerRequest.PING;

    handle(socket: UDPPlayerSocket) {

        if (!socket.identified || !socket.player) return;
        const sender = socket.player;

        let e = performance.now();
        sender.ping.ms = e - (sender.ping.lastSent ?? e);

        let response = new UResPing();
        response.requesting = 0;
        response.ping = sender.ping.ms;
        sender.send(response);
    }


}