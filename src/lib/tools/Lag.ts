import Player from "../components/Player";
import { fps, gravityVec } from "../Macros";
import Vector2 from "./vector/Vector2";

let fpsms = 1000/fps;

type Prediction = {
    pos: Vector2,
    mov: Vector2
}

export default class Lag {

    static compensateCloseProjectile(ping: number){

        return Math.min(ping, 65)/(2.5*fpsms);
    
    }

    static compensateClose(ping: number){

        return Math.min(ping, 250)/(2.1*fpsms);

    }

    static compensatePrecise(ping: number){

        return ping/(2*fpsms);

    }

    static predictPosition(posVec: Vector2, movVec: Vector2, amt: number): Prediction {

        for(let i = 1; i <= amt; i++){

            posVec.add(movVec);
            movVec.add(gravityVec);
    
        }
    
        let s = amt - Math.floor(amt);
        posVec.add(Vector2.multiply(movVec, s));
        movVec.add(Vector2.multiply(gravityVec, s));
        
        return {pos: posVec, mov: movVec};
    
    }

    static predictNextPosition(player: Player){

        return this.predictPosition(
            player.pos,
            player.mov,
            this.compensateClose(player.ping.ms)
        );

    }

}


module.exports = Lag;
