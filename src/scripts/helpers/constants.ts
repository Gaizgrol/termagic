import { Vector3 } from "three";
import type IBaseEntity from "../core/BaseEntity";
import Player from "../entities/Player";
import AnimatedSprite from "../entities/AnimatedSprite";
import Wall from "../entities/Wall";

export const DEGTORAD = Math.PI/180;
export const RADTODEG = 180/Math.PI;
export const UP = new Vector3(0,1,0);

export const loadLevel1 = (): IBaseEntity[] =>
{
	const player = new Player();
    const wall1 = new Wall(10,5);
	wall1.mesh.position.set( 0, 1, -5 );
	const wall2 = new Wall(10,5);
	wall2.mesh.position.set( 0, 1, 5 );
	wall2.mesh.rotateOnAxis( new Vector3( 0, 1, 0 ), 180 * DEGTORAD );
	const wall3 = new Wall(10,5);
	wall3.mesh.position.set( 5, 1, 0 );
	wall3.mesh.rotateOnAxis( new Vector3( 0, 1, 0 ), -90 * DEGTORAD );
	const wall4 = new Wall(10,5);
	wall4.mesh.position.set( -5, 1, 0 );
	wall4.mesh.rotateOnAxis( new Vector3( 0, 1, 0 ), 90 * DEGTORAD );

	const floor = new Wall(10,10,'assets/floor.png');
	floor.mesh.position.set( 0, -1.5, 0 );
	floor.mesh.rotateOnAxis( new Vector3( 1, 0, 0 ), -90 * DEGTORAD );

	const ceil = new Wall(10,10,'assets/ceil.png');
	ceil.mesh.position.set( 0, 3.5, 0 );
	ceil.mesh.rotateOnAxis( new Vector3( 1, 0, 0 ), 90 * DEGTORAD );

	const afrit1 = new AnimatedSprite( 'assets/afrit.png', 3, 100, 100, 3, true );
	const afrit2 = new AnimatedSprite( 'assets/afrit.png', 3, 100, 100, 3, true );
	const afrit3 = new AnimatedSprite( 'assets/afrit.png', 3, 100, 100, 3, true );
	afrit1.sprite.position.set( 3, 0, 0 );
	afrit1.sprite.scale.set( 3, 3, 3 );
	afrit2.sprite.position.set( 3, 0, 3 );
	afrit2.sprite.scale.set( 3, 3, 3 );
	afrit3.sprite.position.set( 1.5, 0, -3.5 );
	afrit3.sprite.scale.set( 3, 3, 3 );

    return [ player, wall1, wall2, wall3, wall4, afrit1, afrit2, afrit3, floor, ceil ];
};