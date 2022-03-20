import { Vector3 } from "three";
import type IBaseEntity from "../core/BaseEntity";
import Player from "../entities/Player";
import Wall from "../entities/Wall";

export const DEGTORAD = Math.PI/180;
export const RADTODEG = 180/Math.PI;
export const UP = new Vector3(0,1,0);

export const loadLevel1 = (): IBaseEntity[] =>
{
	const player = new Player();
    const wall1 = new Wall();
	const wall2 = new Wall();
	const wall3 = new Wall();
	const wall4 = new Wall();
	wall1.mesh.position.set( 0, 0, -5 );
	wall2.mesh.position.set( 0, 0, 5 );
	wall2.mesh.rotateOnAxis( new Vector3( 0, 1, 0 ), 180 * DEGTORAD );
	wall3.mesh.position.set( 5, 0, 0 );
	wall3.mesh.rotateOnAxis( new Vector3( 0, 1, 0 ), -90 * DEGTORAD );
	wall4.mesh.position.set( -5, 0, 0 );
	wall4.mesh.rotateOnAxis( new Vector3( 0, 1, 0 ), 90 * DEGTORAD );

    return [ player, wall1, wall2, wall3, wall4 ];
};