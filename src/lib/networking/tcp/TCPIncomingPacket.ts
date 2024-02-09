import TCPPacket from "./TCPPacket";
import TCPPlayerSocket from "./TCPPlayerSocket";

export default abstract class TCPIncomingPacket extends TCPPacket {

    abstract handle(socket: TCPPlayerSocket): void;

}
