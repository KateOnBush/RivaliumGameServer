import {FormattedPacket} from "../FormattedPacket";
import EPacketChannel from "../../enums/EPacketChannel";

export default abstract class UDPPacket extends FormattedPacket {

    static override channel = EPacketChannel.UDP;

}