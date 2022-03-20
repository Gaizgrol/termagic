import type { Mesh } from "three";

export default interface IBaseEntity
{
    mesh?: Mesh;
    update( dt: number ): void;
}