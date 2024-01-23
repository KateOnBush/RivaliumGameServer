import Player from "../components/Player";

export default interface IncomingPacket {

    handle: (sender: Player) => void;

}