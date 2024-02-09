import {FormattedPacket} from "../FormattedPacket";
import EPacketChannel from "../../enums/EPacketChannel";

export default abstract class TCPPacket extends FormattedPacket {

    static override channel = EPacketChannel.TCP;

}