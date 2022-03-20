import { MeshBasicMaterial, Mesh, PlaneGeometry, TextureLoader, RepeatWrapping, NearestFilter, NearestMipMapNearestFilter, DoubleSide, Texture } from 'three';
import type IBaseEntity from '../core/BaseEntity';

export const brickTexture = new TextureLoader().load( 'assets/brick.png' );
brickTexture.wrapS = RepeatWrapping;
brickTexture.wrapT = RepeatWrapping;
brickTexture.magFilter = NearestFilter;
brickTexture.minFilter = NearestMipMapNearestFilter;

export default class Wall implements IBaseEntity
{
    private plane: PlaneGeometry;
    private material: MeshBasicMaterial;

    public mesh: Mesh;
    
    constructor( texture?: Texture )
    {
        const w = 10;
        const h = 3;

        this.plane = new PlaneGeometry( w, h );
        
        const uvMapping = this.plane.getAttribute('uv');
        uvMapping.setXY( 0, 0, h );
        uvMapping.setXY( 1, w, h );
        uvMapping.setXY( 2, 0, 0 );
        uvMapping.setXY( 3, w, 0 );

        this.material = new MeshBasicMaterial({ map: texture ?? brickTexture });

        this.mesh = new Mesh( this.plane, this.material );
    }

    update(dt: number): void {}
}