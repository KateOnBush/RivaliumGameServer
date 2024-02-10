import EBufferType from "../../../enums/EBufferType";
import {TCPServerResponse} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import TCPPacket from "../TCPPacket";

export default class TResProjectileDestroy extends TCPPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("projId", EBufferType.UInt16)
        .build();
    static override index = TCPServerResponse.PROJECTILE_DESTROY;

    projId: number;

}