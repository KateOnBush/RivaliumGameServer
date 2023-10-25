import {FormattedPacket} from "../../FormattedPacket";
import EPacketChannel from "../../../enums/EPacketChannel";
import EBufferType from "../../../enums/EBufferType";
import {TCPServerResponse} from "../../../enums/TCPPacketTypes";
import {EPreMatchState} from "../../../enums/EPreMatchState";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";

export default class TResPlayerConnection extends FormattedPacket {

    channel = EPacketChannel.TCP;
    attributes = new FormattedPacketAttributeListBuilder().build();
    index: TCPServerResponse.GAME_STATE;

    state: EPreMatchState = 0;

}