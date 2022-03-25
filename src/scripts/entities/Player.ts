import { Vector3 } from 'three';
import type IBaseEntity from '../core/IBaseEntity';
import Level from '../core/Level';
import Hand from '../drawables/Hand';
import { DEGTORAD, UP } from '../helpers/constants';
import type AnimatedSprite from './AnimatedSprite';

export default class Player implements IBaseEntity
{
    public acceleration: number;
    public maxSpeed: number;
    public velocity: Vector3;
    
    private headLevel: number;
    private walkCounter: number;
    private walkPeak: number;
    private dir: Vector3;
    private frictionFactor: number;
    private pos: Vector3;
    private targetUUID: string;

    private hand: Hand;

    constructor()
    {
        this.velocity = new Vector3();
        this.acceleration = 0.5;
        this.frictionFactor = 0.9;
        this.maxSpeed = 5;
        this.walkCounter = 0;
        this.walkPeak = 0.1;
        this.targetUUID = null;
        this.pos = new Vector3();
        this.headLevel = this.position.y;
        this.dir = new Vector3( 1, 0, 0 );
        this.hand = new Hand();
        Level.registerGUIElement( this.hand );
    }

    private move( dt: number )
    {
        const rightVec = this.dir.clone().normalize().applyAxisAngle( UP, 90 * DEGTORAD );

        // Aceleração
        let forward = 0;
        let strafe = 0;
        if ( Level.keys.ArrowUp ) forward += 1;
        if ( Level.keys.ArrowDown ) forward -= 1;
        if ( Level.keys.ArrowLeft && Level.keys.Shift ) strafe += 1;
        if ( Level.keys.ArrowRight && Level.keys.Shift ) strafe -= 1;

        const frontMoveDir = this.dir.clone().normalize().multiplyScalar( forward );
        const rightMoveDir = rightVec.normalize().multiplyScalar( strafe );
        const moveDir = frontMoveDir.add( rightMoveDir ).normalize().multiplyScalar( dt );

        this.velocity = this.velocity.add( moveDir ).multiplyScalar( this.frictionFactor );

        const scaledMaxSpeed = this.maxSpeed * dt;
        
        if ( this.velocity.lengthSq() > scaledMaxSpeed**2 )
            this.velocity = this.velocity.setLength( scaledMaxSpeed );

        // Movimentação
        this.position = this.position.add( this.velocity );
    }

    private calculateRotation(dt: number)
    {
        // Rotação
        Level.events['cursor_move'].forEach( ev => this.rotate( -ev.dx * 0.1 ) );
        let ang = 0;
        if ( Level.keys.ArrowLeft && !Level.keys.Shift ) ang = 1;
        if ( Level.keys.ArrowRight && !Level.keys.Shift ) ang = -1;
        ang = ang * 30 * this.maxSpeed;
        this.rotate( ang*dt )
    }

    private calculateHeadPosition(dt: number)
    {
        const count = ( this.walkCounter + this.velocity.length()*3.5 ) % ( 2*Math.PI );
        this.hand.counter = count;
        this.walkCounter = count;
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
        const target = Level.enemies[this.targetUUID];
        Level.timeDilation = target ? 0.1 : 1;

        this.calculateRotation( dt );
        this.move( dt );
        this.calculateHeadPosition( dt );

        if ( Level.events['key_pressed'].map( ev => ev.key as string ).includes( 'Control' ) )
        {
            if ( target )
            {
                target.mesh.material['color'].set( 0xFFFFFF );
                this.targetUUID = null;
                return;
            }

            const obj = Level.raycast( 0, 0 );
            if ( !obj ) return;

            const enemy = Level.enemies[ obj.object.uuid ];
            if ( !enemy ) return;

            enemy.mesh.material['color'].set( 0xFF0000 );
            this.targetUUID = obj.object.uuid;
        }
    }
}