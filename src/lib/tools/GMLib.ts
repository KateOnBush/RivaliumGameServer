export default class GM {

    static point_direction(x1: number, y1: number, x2: number, y2: number){
        return Math.atan2(y1 - y2, x2 - x1) * 180/Math.PI;
    }

    static point_distance(x1: number, y1: number, x2: number, y2: number){
        return Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);
    }

    static lengthdir_x(length: number, dir: number){
        return length * Math.cos(dir * Math.PI/180);
    }

    static lengthdir_y(length: number, dir: number){
        return -length * Math.sin(dir * Math.PI/180);
    }

    static random_range(n: number, m: number){
        return Math.random() * (m - n) + n;
    }
    

    static lerp(a: number, b: number, n: number){
        return a + (b - a) * n;
    }

    static dtlerp(a: number, b: number, n: number, dt: number){
        return this.lerp(a, b, 1 - Math.pow(1 - n, dt));
    }

}