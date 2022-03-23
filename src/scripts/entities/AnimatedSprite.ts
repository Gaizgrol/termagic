import { Mesh, MeshBasicMaterial, PlaneGeometry, Sprite, SpriteMaterial } from "three";
import type IBaseEntity from "../core/BaseEntity";
import Level from "../core/Level";
import TexturePool from "../core/TexturePool";

export default class AnimatedSprite implements IBaseEntity
{
    private geometry: PlaneGeometry;
    private material: MeshBasicMaterial;
    private nFrames: number;
    private actualFrame: number;
    private frameW: number;
    private frameH: number;
    private timer: number;
    
    public framesPerSecond: number;
    public mesh: Mesh;
    
    constructor(
        texturePath: string,
        nFrames: number,
        frameW: number,
        frameH: number,
        framesPerSecond: number,
        shuffle = false
    ) {
        const map = TexturePool.get( texturePath );

        this.geometry = new PlaneGeometry();
        this.material = new MeshBasicMaterial({ map, transparent: true });
        this.mesh = new Mesh( this.geometry, this.material );

        this.nFrames = nFrames;
        this.frameW = frameW;
        this.frameH = frameH;
        this.framesPerSecond = framesPerSecond;
        this.timer = 0;
        
        this.actualFrame = shuffle ? Math.floor( Math.random() * nFrames ) : 0;
        this.updateUVs();

        Level.enemies[ this.mesh.uuid ] = this;
    }

    private nextFrame()
    {
        this.actualFrame = ++this.actualFrame % this.nFrames;
        this.updateUVs();
    }

    private updateUVs(): void
    {
        const { width: iw, height: ih } = this.material.map.image;
        
        const i = this.actualFrame;

        const w = Math.floor( iw / this.frameW );
        const h = Math.floor( ih / this.frameH );

        const x = i%w;
        const y = Math.floor( i/w );

        const uw = 1/w;
        const uh = 1/h;

        const ux = x*uw;
        const uy = 1-y*uh;

        const uvMapping = this.geometry.getAttribute('uv');
        
        //______________________________________//
        //                  |                   //
        //  Vertex order    |   UV Mapping      //
        //                  |                   //
        //   v0 ---- v1     |  (0,1)----(1,1)   //
        //    |     / |     |    |     / |      //
        //    |   /   |     |    |   /   |      //
        //    | /     |     |    | /     |      //
        //   v2 ---- v3     |  (0,0)----(1,0)   //
        //__________________|___________________//

        uvMapping.setXY( 0, ux, uy );
        uvMapping.setXY( 1, ux+uw, uy );
        uvMapping.setXY( 2, ux, uy-uh );
        uvMapping.setXY( 3, ux+uw, uy-uh );
        uvMapping.needsUpdate = true;
    }

    public update( dt: number ): void
    {
        const camDir = Level.mainCamera.rotation;
        this.mesh.rotation.set( camDir.x, camDir.y, camDir.z );

        this.timer += dt;
        
        if ( this.timer >= 1/this.framesPerSecond )
        {
            this.timer = 0;
            this.nextFrame();
        }
    }
}