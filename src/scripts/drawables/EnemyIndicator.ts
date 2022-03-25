import type IDrawable from "../core/IDrawable";

export default class EnemyIndicator implements IDrawable
{
    private ctx: CanvasRenderingContext2D;

    public visible: boolean;

    constructor()
    {
        this.visible = true;
    }

    draw(): void
    {
        if ( !this.visible ) return;
        const {ctx} = this;

        const cx = 200, cy = 200, w = 100, h = 100;

        ctx.fillStyle = "#FF7F00";
        ctx.fillRect( cx - w/2, cy - w/2, w, h );
    }

    setContext( ctx: CanvasRenderingContext2D ): void
    {
        this.ctx = ctx;
    }
}