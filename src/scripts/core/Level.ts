import { Scene } from 'three';
import type { PerspectiveCamera, WebGLRenderer } from 'three';
import type IBaseEntity from './BaseEntity';
import type { Dict } from './TexturePool';

export default class Level
{
    private static lastFrame: number = -1;
    private static objects: IBaseEntity[] = [];
    private static renderer: WebGLRenderer;
    private static scene: Scene;
    
    public static events: Dict<any> = {};
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
        Level.renderer.render( Level.scene, Level.mainCamera );
    }
    
    private static update()
    {
        const dt = ( Level.lastFrame === 0 ) ? 1/60 : (Date.now() - Level.lastFrame)/1000;
        Level.lastFrame = Date.now();

        for ( const obj of Level.objects )
            obj.update?.( dt * this.timeDilation );
    }

    public static init( renderer: WebGLRenderer, camera: PerspectiveCamera )
    {
        Level.flushEvents();
        Level.scene = new Scene();
        Level.renderer = renderer;
        Level.mainCamera = camera;
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

    public static run()
    {
        Level.update();
        Level.render();
        Level.flushEvents();
    }
}