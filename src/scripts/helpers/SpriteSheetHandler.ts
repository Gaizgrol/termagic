import { Vector2 } from "three";

export default class SpriteSheetHandler
{
    private nFrames: number;
    private sheetSize: Vector2;
    private spriteSize: Vector2;

    constructor( sheetSize: Vector2, spriteSize: Vector2, nFrames: number )
    {
        this.sheetSize = sheetSize;
        this.spriteSize = spriteSize;
        this.nFrames = nFrames;
    }

    public getUVs( spriteIndex: number ): Vector2[]
    {
        const i = spriteIndex % this.nFrames;

        const w = Math.floor( this.sheetSize.x / this.spriteSize.x );
        const h = Math.floor( this.sheetSize.y / this.spriteSize.y );

        const x = i%w;
        const y = Math.floor( i/w );

        const uw = 1/w;
        const uh = 1/h;

        const ux = x*uw;
        const uy = 1-y*uh;

        return [
            new Vector2( ux, uy ),
            new Vector2( ux+uw, uy ),
            new Vector2( ux, uy-uh ),
            new Vector2( ux+uw, uy-uh )
        ];
    }

    public getCoords( spriteIndex: number ): Vector2[]
    {
        return this.getUVs( spriteIndex ).map( uv => new Vector2(
            Math.round( this.sheetSize.x * uv.x ),
            Math.round( this.sheetSize.y * (1-uv.y) )
        ));
    }
}