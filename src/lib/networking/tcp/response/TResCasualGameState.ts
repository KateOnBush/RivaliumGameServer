import EBufferType from "../../../enums/EBufferType";
import {TCPServerResponse} from "../../../enums/TCPPacketTypes";
import FormattedPacketAttributeListBuilder from "../../attributes/FormattedPacketAttributeListBuilder";
import TCPPacket from "../TCPPacket";
import {CasualGameState} from "../../../components/games/CasualGame";

export default class TResCasualGameState extends TCPPacket {

    static override attributes = new FormattedPacketAttributeListBuilder()
        .add("state", EBufferType.UInt8)
        .add("currentRound", EBufferType.UInt8)
        .add("defendingTeam", EBufferType.UInt8)
        .add("firstTeamScore", EBufferType.UInt8)
        .add("secondTeamScore", EBufferType.UInt8)
        .build();
    static override index = TCPServerResponse.CASUAL_GAME_STATE;

    state: CasualGameState = 0;
    currentRound: number = 0;
    defendingTeam: number = 0;
    firstTeamScore: number = 0;
    secondTeamScore: number = 0;

}