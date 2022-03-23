import { Raycaster, Scene, Vector2 } from 'three';
import type { PerspectiveCamera, WebGLRenderer } from 'three';
import type IBaseEntity from './BaseEntity';
import type { Dict } from './TexturePool';
import type AnimatedSprite from '../entities/AnimatedSprite';

let last = Date.now()
let t = 0;

export default class Level
{
    private static lastFrame: number = -1;
    private static objects: IBaseEntity[] = [];
    private static renderer: WebGLRenderer;
    private static scene: Scene;
    private static ctx: CanvasRenderingContext2D;
    private static caster: Raycaster;
    
    public static enemies: Dict<AnimatedSprite> = {};
    public static gui: HTMLCanvasElement;
    public static events: Dict<any> = {
        'cursor_move': []
    };
    public static mainCamera: PerspectiveCamera = null;
    public static timeDilation: number = 1;
    public static keys: Dict<boolean> = {};

    private static flushEvents()
    {
        Level.events = {
            'cursor_move': []
        }
    }

    public static render()
    {
        // Renderiza a cena 3D
        Level.renderer.render( Level.scene, Level.mainCamera );
        // Renderiza a interface 2D
        const { ctx, gui } = Level;
        ctx.clearRect(0, 0, gui.width, gui.height );
    }
    
    private static update()
    {
        const dt = ( Level.lastFrame === 0 ) ? 1/60 : (Date.now() - Level.lastFrame)/1000;
        Level.lastFrame = Date.now();

        for ( const obj of Level.objects )
            obj.update?.( dt * this.timeDilation );
    }

    public static init( renderer: WebGLRenderer, gui: HTMLCanvasElement, camera: PerspectiveCamera )
    {
        Level.flushEvents();
        Level.scene = new Scene();
        Level.gui = gui;
        Level.ctx = gui.getContext('2d');
        Level.renderer = renderer;
        Level.mainCamera = camera;
        Level.caster = new Raycaster();
        Level.enemies = {};
    }

    public static load( objs: IBaseEntity[] )
    {
        objs.forEach( obj =>
        {
            Level.objects.push( obj );
            if ( obj.mesh )
                Level.scene.add( obj.mesh );
        });
    }

    public static raycast( screenPosX: number, screenPosY: number )
    {
        Level.caster.setFromCamera({ x: screenPosX, y: screenPosY }, Level.mainCamera );
        const closest = Level.caster.intersectObjects( Level.scene.children )[0];
        return closest ?? null;
    }

    public static run()
    {
        Level.update();
        Level.render();
        Level.flushEvents();
    }
}