import GM from "../GMLib";
import Vector3 from "./Vector3";

export default class Vector2 extends Vector3 {

    z = 0;

    static cartesian(x: number, y: number){

        let v = new Vector2();
        v.x = x;
        v.y = y;
        return v;

    }

    static polar(len: number, dir: number){

        return this.cartesian(
            GM.lengthdir_x(len, dir),
            GM.lengthdir_y(len, dir)
        );

    }

    direction(){
        return GM.point_direction(0, 0, this.x, this.y);
    }
    

}