import { Mesh, MeshBasicMaterial, PlaneGeometry, Sprite, SpriteMaterial, Vector2 } from "three";
import type IBaseEntity from "../core/IBaseEntity";
import Level from "../core/Level";
import TexturePool from "../core/TexturePool";
import SpriteSheetHandler from "../helpers/SpriteSheetHandler";

export default class AnimatedSprite implements IBaseEntity
{
    private geometry: PlaneGeometry;
    private material: MeshBasicMaterial;
    private nFrames: number;
    private actualFrame: number;
    private imgHandler: SpriteSheetHandler;
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
        this.imgHandler = new SpriteSheetHandler(
            new Vector2( map.image.width, map.image.height ),
            new Vector2( frameW, frameH ),
            nFrames
        );
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
        const uvs = this.imgHandler.getUVs( this.actualFrame );
        const uvMapping = this.geometry.getAttribute('uv');
        for ( let i=0; i<uvMapping.count; i++ )
            uvMapping.setXY( i, uvs[i].x, uvs[i].y );
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