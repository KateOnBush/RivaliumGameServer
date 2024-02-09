import TCPPacket from "../tcp/TCPPacket";
import TCPPlayerSocket from "../tcp/TCPPlayerSocket";
import UDPPlayerSocket from "./UDPPlayerSocket";
import IncomingPacket from "../IncomingPacket";

export default abstract class UDPIncomingPacket extends TCPPacket {

    abstract handle(socket: UDPPlayerSocket): void;

}
