import Afrit from "../entities/enemies/Afrit";
import Player from "../entities/Player";
import Wall from "../entities/Wall";
import { AXIS_X, AXIS_Y } from "../helpers/constants";

export const testLevel = () => [
    new Wall( 10,10, 0,3.5,0, AXIS_X,90, 'assets/ceil.png'),
    
    new Wall(20,5, 0,1,-10 ),
	new Wall(20,5, 0,1,10, AXIS_Y,180 ),
	new Wall(20,5, 10,1,0, AXIS_Y,-90 ),
	new Wall(20,5, -10,1,0, AXIS_Y,90 ),
	
    new Player(),

    new Afrit( 3, 0, 0 ),
	new Afrit( 3, 0, 3 ),
	new Afrit( 1.5, 0, -3.5 ),
    
	new Wall( 10,10, 0,-1.5,0, AXIS_X,-90, 'assets/floor.png')
];