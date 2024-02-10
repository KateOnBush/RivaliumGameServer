import {FormattedPacket} from "./FormattedPacket";
import UDPPlayerSocket from "./udp/UDPPlayerSocket";
import TCPPlayerSocket from "./tcp/TCPPlayerSocket";

export default interface IncomingPacket extends FormattedPacket {

    new(): FormattedPacket;
    handle(socket: UDPPlayerSocket | TCPPlayerSocket): void;

}