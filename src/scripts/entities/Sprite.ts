import type { PerspectiveCamera, Texture } from "three";
import type IBaseEntity from "../core/BaseEntity";
import { UP } from "../helpers/constants";
import Wall from "./Wall";

export default class Sprite implements IBaseEntity
{
    private camera: PerspectiveCamera;
    private plane: Wall;

    constructor( camera: PerspectiveCamera, texture: Texture )
    {
        this.camera = camera;
        this.plane = new Wall();
    }

    public update(dt: number) {
        throw new Error("Method not implemented.");
    }
}