import AnimatedSprite from "../AnimatedSprite";

export default class Afrit extends AnimatedSprite
{
    constructor( posX: number, posY: number, posZ: number )
    {
        super( 'assets/afrit.png', 3, 100, 100, 3, true );
        this.mesh.position.set( posX, posY, posZ );
        this.mesh.scale.set( 3, 3, 3 );
    }
}