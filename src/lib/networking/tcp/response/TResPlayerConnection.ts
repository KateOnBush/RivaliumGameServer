import {TCPServerResponse} from "../../../enums/TCPPacketTypes";
import {EPreMatchState} from "../../../enums/EPreMatchState";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import TCPPacket from "../TCPPacket";

export default class TResPlayerConnection extends TCPPacket {

    static override attributes = new FormattedPacketAttributeListBuilder().build();
    static override index = TCPServerResponse.PLAYER_CONNECTION;

    state: EPreMatchState = 0;

}