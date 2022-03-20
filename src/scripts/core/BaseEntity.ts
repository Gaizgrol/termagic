import type { Mesh, Sprite } from "three";

export default interface IBaseEntity
{
    mesh?: Mesh;
    sprite?: Sprite;
    update?( dt: number ): void;
}