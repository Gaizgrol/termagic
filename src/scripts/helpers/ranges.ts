import type { Vector3 } from "three";

export const limit = ( val: Vector3, min: number, max: number ): number =>
{
    return ( val.lengthSq() < min*min ) ? min : ( val.lengthSq() > max*max ) ? max : val.length();
}