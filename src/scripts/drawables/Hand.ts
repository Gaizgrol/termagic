import { Vector2 } from "three";
import type IDrawable from "../core/IDrawable";
import Level from "../core/Level";
import TexturePool from "../core/TexturePool";
import SpriteSheetHandler from "../helpers/SpriteSheetHandler";

export default class Hand implements IDrawable
{
    private ctx: CanvasRenderingContext2D;
    private handHandler: SpriteSheetHandler;
    private handImage: HTMLImageElement;
    private walkCounter: number;
    
    public index: number;

    constructor()
    {
        this.index = 0;
        this.handImage = TexturePool.get( 'assets/hands.png' ).source.data;
        this.handHandler = this.handHandler = new SpriteSheetHandler(
            new Vector2(this.handImage.width, this.handImage.height),
            new Vector2( 100, 100 ),
            6
        );
    }

    private calculateHandShake(): Vector2
    {
        return new Vector2(
            Math.abs( Math.sin( this.walkCounter/2 ) * 16 ),
            Math.abs( Math.cos( this.walkCounter/2 ) * 16 )
        );
    }

    public set counter( value: number )
    {
        this.walkCounter = value % ( 2* Math.PI );
    }
    
    public setContext( ctx: CanvasRenderingContext2D ): void
    {
        this.ctx = ctx;
    }

    public draw(): void
    {
        const gui = Level.gui;
        const coords = this.handHandler.getCoords( this.index );
        const dh = gui.height * (1/3), dw = dh;
        const dx = gui.width/2, dy = gui.height - dh;
        const shake = this.calculateHandShake();
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.drawImage( this.handImage,
            coords[0].x, coords[0].y, coords[1].x - coords[0].x, coords[2].y - coords[0].y,
            dx + shake.x, dy + shake.y, dw, dh
        );
    }
}