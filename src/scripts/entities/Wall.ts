import { MeshBasicMaterial, Mesh, PlaneGeometry, TextureLoader, RepeatWrapping, NearestFilter, NearestMipMapNearestFilter, DoubleSide, Texture } from 'three';
import type IBaseEntity from '../core/BaseEntity';
import TexturePool from '../core/TexturePool';

export default class Wall implements IBaseEntity
{
    private plane: PlaneGeometry;
    private material: MeshBasicMaterial;

    public mesh: Mesh;
    
    constructor( w: number, h: number, texturePath?: string )
    {

        this.plane = new PlaneGeometry( w, h );
        
        const uvMapping = this.plane.getAttribute('uv');
        uvMapping.setXY( 0, 0, 2*h );
        uvMapping.setXY( 1, 2*w, 2*h );
        uvMapping.setXY( 2, 0, 0 );
        uvMapping.setXY( 3, 2*w, 0 );

        this.material = new MeshBasicMaterial({ map: texturePath ? TexturePool.get( texturePath ) : TexturePool.get('assets/brick.png') });

        this.mesh = new Mesh( this.plane, this.material );
    }
}