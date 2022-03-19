import { PerspectiveCamera, Vector3 } from 'three';
import { DEGTORAD } from './constants';

export default class Player
{
    private pos: Vector3;
    private dir: Vector3;
    private up: Vector3;
    public camera: PerspectiveCamera;

    constructor()
    {
        this.pos = new Vector3();
        this.dir = new Vector3( 1, 0, 0 );
        this.up = new Vector3( 0, 1, 0 );
        this.camera = new PerspectiveCamera( 75, window.innerHeight / window.innerHeight, 0.1, 1000 );
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
        this.camera.position.set( pos.x, pos.y, pos.z );
    }

    public rotate( angle: number ): void
    {
        this.dir.applyAxisAngle( this.up, angle * DEGTORAD );
        const focus = (new Vector3()).copy( this.pos ).add( this.dir );
        this.camera.lookAt( focus );
    }
}