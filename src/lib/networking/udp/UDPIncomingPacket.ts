import TCPPacket from "../tcp/TCPPacket";
import UDPPlayerSocket from "./UDPPlayerSocket";
import UDPPacket from "./UDPPacket";

export default abstract class UDPIncomingPacket extends UDPPacket {

    abstract handle(socket: UDPPlayerSocket): void;

}
