import EBufferType from "../../../enums/EBufferType";
import {TCPServerResponse} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import TCPPacket from "../TCPPacket";

export default class TResTimerUpdate extends TCPPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("timer", EBufferType.UInt8)
        .add("timerType", EBufferType.UInt8)
        .build();
    static override index = TCPServerResponse.TIMER_UPDATE;

    timer: number = 0;
    timerType: number = 0;

}