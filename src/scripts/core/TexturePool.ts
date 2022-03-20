import { Texture, TextureLoader } from "three";

export interface Dict<V>
{
    [key: string]: V
}

export default class TexturePool
{
    private static data: Dict<Texture> = {};
    private static loader = new TextureLoader();

    public static get( file: string ): Texture
    {
        let tex = TexturePool.data[file];
        if ( !tex )
            tex = TexturePool.data[file] = TexturePool.loader.load( file );
        return tex;
    }

    public static remove( file: string ): boolean
    {
        let tex = TexturePool.data[file];
        if ( !tex )
            return false;
        tex.dispose();
        delete TexturePool.data[file];
    }
}