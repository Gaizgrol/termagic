export default interface IDrawable
{
    draw(): void;
    setContext( ctx: CanvasRenderingContext2D ): void;
}