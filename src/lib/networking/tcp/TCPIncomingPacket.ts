import TCPPacket from "./TCPPacket";
import TCPPlayerSocket from "./TCPPlayerSocket";
import IncomingPacket from "../IncomingPacket";

export default abstract class TCPIncomingPacket extends TCPPacket{

    abstract handle(socket: TCPPlayerSocket): void;

}
