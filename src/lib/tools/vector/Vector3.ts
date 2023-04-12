import Vector2 from "./Vector2";

export default class Vector3 {

    x: number = 0;
    y: number = 0;
    z: number = 0;

    static cartesian(x: number, y: number, z: number): Vector3 {
        let v = new Vector3();
        v.x = x;
        v.y = y;
        v.z = z;
        return v;
    }

    set(x: number, y: number){
        this.x = x;
        this.y = y;
    }

    add(v: Vector3){
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
    }

    static add(a: Vector3, b: Vector3){
        return this.cartesian(
            a.x + b.x,
            a.y + b.y,
            a.z + b.z 
        );
    }

    subtract(v: Vector3){
        this.x -= v.x;
        this.y -= v.y;
    }

    static subtract(a: Vector3, b: Vector3){
        return this.cartesian(
            a.x - b.x,
            a.y - b.y,
            a.z - b.z 
        );
    }

    multiply(a: number){
        this.x *= a;
        this.y *= a;
    }

    static multiply(v: Vector3, a: number){
        return this.cartesian(
            v.x * a,
            v.y * a,
            v.z * a
        );
    }

    divide(a: number){
        a == 0 ? this.multiply(0) : this.multiply(1/a);
    }

    magnitude(){
        return Math.sqrt(this.x**2 + this.y**2 + this.z**2);
    }

    normalize(){
        this.multiply(this.magnitude() == 0 ? 0 : 1/this.magnitude());
    }

    static divide(v: Vector3, a: number){
        return this.cartesian(
            a == 0 ? 0 : v.x / a,
            a == 0 ? 0 : v.y / a,
            a == 0 ? 0 : v.z / a
        );
    }

    static dot(a: Vector3, b: Vector3){
        return a.x * b.x + a.y * b.y * a.z * b.z;
    }

    static cross(a: Vector3, b: Vector3){
        var i = a.y * b.z - a.z * b.y;
		var j = a.z * b.x - a.x * b.z;
		var k = a.x * b.y - a.y * b.x;
		
		return Vector3.cartesian(i, j, k);
    }

    project2d() {

        return Vector2.cartesian(this.x, this.y);

    }

}