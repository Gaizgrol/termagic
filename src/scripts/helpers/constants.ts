import { Vector3 } from "three";
import type IBaseEntity from "../core/IBaseEntity";
import Player from "../entities/Player";
import AnimatedSprite from "../entities/AnimatedSprite";
import Wall from "../entities/Wall";
import Afrit from "../entities/enemies/Afrit";

export const DEGTORAD = Math.PI/180;
export const RADTODEG = 180/Math.PI;
export const AXIS_X = new Vector3(1,0,0);
export const AXIS_Y = new Vector3(0,1,0);
export const AXIS_Z = new Vector3(0,0,1);
export const UP = AXIS_Y;

export const loadLevel1 = (): IBaseEntity[] =>
{
	const player = new Player();

    const wall1 = new Wall(20,5, 0,1,-10 );
	const wall2 = new Wall(20,5, 0,1,10, AXIS_Y,180 );
	const wall3 = new Wall(20,5, 10,1,0, AXIS_Y,-90 );
	const wall4 = new Wall(20,5, -10,1,0, AXIS_Y,90 );

	const floor = new Wall( 10,10, 0,-1.5,0, AXIS_X,-90, 'assets/floor.png');
	const ceil = new Wall( 10,10, 0,3.5,0, AXIS_X,90, 'assets/ceil.png');

	const afrit1 = new Afrit( 3, 0, 0 );
	const afrit2 = new Afrit( 3, 0, 3 );
	const afrit3 = new Afrit( 1.5, 0, -3.5 );

    return [ player, wall1, wall2, wall3, wall4, afrit1, afrit2, afrit3, floor, ceil ];
};