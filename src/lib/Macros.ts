import Vector2 from "./tools/vector/Vector2";

export const serverPort = 2003;

export const dataSize = 64;
export const entityParametersLimit = 6;
export const fps = 60;
export const gravity = .35;
export const gravityVec = Vector2.cartesian(0, gravity);
export const defaultBounceFriction = 0.7;


export const EMPTY_METHOD = ()=>{};