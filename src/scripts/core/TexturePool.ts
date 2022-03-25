import { NearestFilter, NearestMipMapNearestFilter, RepeatWrapping, Texture, TextureLoader } from "three";

export interface Dict<V>
{
    [key: string]: V
}

export default class TexturePool
{
    private static data: Dict<Texture> = {};
    private static loader = new TextureLoader();

    public static async preload(): Promise<void>
    {
        for ( const img of [ 'afrit', 'brick', 'ceil', 'floor', 'hands' ] )
		{
			const path = `assets/${img}.png`;
			await TexturePool.load( path );
            console.log( `Loaded ${path}` );
		}
    }

    public static async load( file: string ): Promise<Texture>
    {
        let tex = TexturePool.data[file];
        if ( !tex )
        {
            tex = TexturePool.data[file] = await TexturePool.loader.loadAsync( file );
            tex.wrapS = RepeatWrapping;
            tex.wrapT = RepeatWrapping;
            tex.magFilter = NearestFilter;
            tex.minFilter = NearestMipMapNearestFilter;
        }

        return tex;
    }

    public static get( file: string ): Texture
    {
        let tex = TexturePool.data[ file ];
        if ( !tex )
            throw new Error( `Texture ${file} does not exist!` );
        return tex;
    }
}