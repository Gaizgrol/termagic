import { MeshBasicMaterial, Mesh, PlaneGeometry, Vector3 } from 'three';
import type IBaseEntity from '../core/IBaseEntity';
import TexturePool from '../core/TexturePool';
import { AXIS_Y, DEGTORAD } from '../helpers/constants';

export default class Wall implements IBaseEntity
{
    private plane: PlaneGeometry;
    private material: MeshBasicMaterial;

    public mesh: Mesh;
    
    constructor(
        w: number, h: number,
        x: number, y: number, z: number,
        axis: Vector3 = AXIS_Y,
        rotation: number = 0,
        texturePath?: string
    )
    {
        this.plane = new PlaneGeometry( w, h );
        
        const uvMapping = this.plane.getAttribute('uv');
        uvMapping.setXY( 0, 0, 2*h );
        uvMapping.setXY( 1, 2*w, 2*h );
        uvMapping.setXY( 2, 0, 0 );
        uvMapping.setXY( 3, 2*w, 0 );

        this.material = new MeshBasicMaterial({ map: texturePath ? TexturePool.get( texturePath ) : TexturePool.get('assets/brick.png') });

        this.mesh = new Mesh( this.plane, this.material );
        this.mesh.position.set( x, y, z );
	    this.mesh.rotateOnAxis( axis, rotation * DEGTORAD );
    }
}