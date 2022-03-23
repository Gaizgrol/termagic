import { Mesh, PerspectiveCamera, Vector3 } from 'three';
import type IBaseEntity from '../core/BaseEntity';
import Level from '../core/Level';
import { DEGTORAD, UP } from '../helpers/constants';
import { limit } from '../helpers/ranges';
import AnimatedSprite from './AnimatedSprite';

export default class Player implements IBaseEntity
{
    public acceleration: number;
    public maxSpeed: number;
    public velocity: number;
    
    private headLevel: number;
    private walkCounter: number;
    private walkPeak: number;
    private dir: Vector3;
    private frictionFactor: number;
    private pos: Vector3;

    constructor()
    {
        this.velocity = 0;
        this.acceleration = 0.5;
        this.frictionFactor = 0.9;
        this.maxSpeed = 3;
        this.walkCounter = 0;
        this.walkPeak = 0.1;
        
        this.pos = new Vector3();
        this.headLevel = this.position.y;
        this.dir = new Vector3( 1, 0, 0 );
    }

    private move(dt: number)
    {
        // Aceleração
        let dir = 0;
        if ( Level.keys.ArrowUp ) dir += 1;
        if ( Level.keys.ArrowDown ) dir -= 1;
        this.velocity += this.acceleration * dir;

        // Fricção
        this.velocity = limit( this.velocity, -this.maxSpeed, this.maxSpeed );
        this.velocity *= this.frictionFactor;

        // Movimentação
        const deltaPos = this.dir.clone().multiplyScalar( dt*this.velocity );
        this.position = this.position.add( deltaPos );
    }

    private calculateRotation(dt: number)
    {
        // Rotação
        Level.events['cursor_move'].forEach( ev => this.rotate( -ev.dx * 0.1 ) );
        let ang = 0;
        if ( Level.keys.ArrowLeft ) ang = 1;
        if ( Level.keys.ArrowRight ) ang = -1;
        ang = ang * 30 * this.maxSpeed;
        this.rotate( ang*dt )
    }

    private calculateHeadPosition(dt: number)
    {
        this.walkCounter = ( this.walkCounter + dt*this.velocity*3.5 ) % ( 2*Math.PI )
        this.headLevel = this.position.y + Math.sin( this.walkCounter ) * this.walkPeak;
        Level.mainCamera.position.set( this.position.x, this.headLevel, this.position.z );
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
        const at = this.pos.clone();
        at.set(at.x, this.headLevel, at.z);
        const focus = at.add( this.dir );
        Level.mainCamera.lookAt( focus );
    }

    public update( dt: number ): void
    {
        // Slowdown
        Level.timeDilation = Level.keys.Control ? 0.1 : 1;
        // Walk/Run
        this.maxSpeed = ( Level.keys.Shift ) ? 3 : 5;

        this.calculateRotation( dt );
        this.move( dt );
        this.calculateHeadPosition( dt );

        if ( Level.keys.Control )
        {
            const obj = Level.raycast( 0, 0 );
            if ( !obj ) return;

            const enemy = Level.enemies[ obj.object.uuid ];
            if ( !enemy ) return;

            enemy.mesh.material['color'].set( 0xFF0000 );
        }
    }
}