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
    }
}