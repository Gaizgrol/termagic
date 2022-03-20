import { Sprite, SpriteMaterial } from "three";
import type IBaseEntity from "../core/BaseEntity";
import TexturePool from "../core/TexturePool";

export default class AnimatedSprite implements IBaseEntity
{
    private material: SpriteMaterial;
    private nFrames: number;
    private actualFrame: number;
    private frameW: number;
    private frameH: number;
    private lastUpdate: number;
    
    public framesPerSecond: number;
    public sprite: Sprite;
    
    constructor(
        texturePath: string,
        nFrames: number,
        frameW: number,
        frameH: number,
        framesPerSecond: number,
        shuffle = false
    ) {
        const map = TexturePool.get( texturePath );

        this.material = new SpriteMaterial({ map });
        this.sprite = new Sprite( this.material );

        this.nFrames = nFrames;
        this.frameW = frameW;
        this.frameH = frameH;
        this.framesPerSecond = framesPerSecond;
        
        this.lastUpdate = Date.now();
        this.actualFrame = shuffle ? Math.floor( Math.random() * nFrames ) : 0;
        console.log( this.actualFrame );
        this.updateUVs();
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
        const y = Math.floor( i*w/this.nFrames );

        const uw = 1/w;
        const uh = 1/h;

        const ux = x*uw;
        const uy = 1-y*uh;

        const uvMapping = this.sprite.geometry.getAttribute('uv');
        // Vertex order
        // 3 2
        // 0 1

        uvMapping.setXY( 0, ux, uy-uh );
        uvMapping.setXY( 1, ux+uw, uy-uh );
        uvMapping.setXY( 2, ux+uw, uy );
        uvMapping.setXY( 3, ux, uy );
        uvMapping.needsUpdate = true;
    }

    public update(): void
    {
        const elapsed = Date.now() - this.lastUpdate;
        
        if ( elapsed >= 1000/this.framesPerSecond )
        {
            this.lastUpdate = Date.now();
            this.nextFrame();
        }
    }
}