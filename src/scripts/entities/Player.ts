import { Mesh, PerspectiveCamera, Vector3 } from 'three';
import type IBaseEntity from '../core/BaseEntity';
import Level from '../core/Level';
import { DEGTORAD, UP } from '../helpers/constants';

export default class Player implements IBaseEntity
{
    private pos: Vector3;
    private dir: Vector3;

    constructor()
    {
        this.pos = new Vector3();
        this.dir = new Vector3( 1, 0, 0 );
    }

    public get direction(): Vector3
    {
        return (new Vector3).copy(this.dir);
    }

    public get position()
    {
        return (new Vector3).copy(this.pos);
    }

    public set position( pos: Vector3 )
    {
        this.pos.copy( pos );
        Level.mainCamera.position.set( pos.x, pos.y, pos.z );
    }

    public rotate( angle: number ): void
    {
        this.dir.applyAxisAngle( UP, angle * DEGTORAD );
        const focus = (new Vector3()).copy( this.pos ).add( this.dir );
        Level.mainCamera.lookAt( focus );
    }

    update( dt: number ): void
    {
        Level.events['cursor_move'].forEach( ev =>
        {
            const { dx } = ev;
            this.rotate( -dx * 0.1 );
        });

        let dir = 0;
        if ( Level.keys.ArrowUp )
            dir += 1;
        if ( Level.keys.ArrowDown )
            dir -= 1;
        
        this.position = this.position.add( this.dir.clone().multiplyScalar(dt*3*dir) );

        let ang = 0;
        if ( Level.keys.ArrowLeft )
            ang += 90;
        if ( Level.keys.ArrowRight )
            ang -= 90;
        this.rotate( ang*dt )
    }
}