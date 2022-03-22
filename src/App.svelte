<script lang="ts">
	import { onMount } from 'svelte';
	import { PerspectiveCamera, TextureLoader, WebGLRenderer } from 'three';
	import Level from './scripts/core/Level';
	import TexturePool from './scripts/core/TexturePool';
	import { loadLevel1 } from './scripts/helpers/constants';
	
	let container: HTMLDivElement;

	const renderer = new WebGLRenderer();
	const canvas = renderer.domElement;
	
	let running = false;

	window.onresize = () =>
	{
		const { innerWidth: iw, innerHeight: ih } = window;
		Level.mainCamera = new PerspectiveCamera( 90, iw/ih, 0.1, 1000 );
		renderer.setSize( iw, ih );
		Level.render();
	}

	window.onmousemove = (ev: MouseEvent) => Level.events['cursor_move'].push({
		dx: ev.movementX,
		dy: ev.movementY
	});

	document.onpointerlockchange = () => { running = !!document.pointerLockElement };
	document.onkeydown = ev => { Level.keys[ev.key] = true };
	document.onkeyup = ev => { Level.keys[ev.key] = false };

	canvas.onclick = () =>
	{
		canvas.requestPointerLock();
		if ( !running )
		{
			running = true;
			run();
		}
	}

	const run = () =>
	{
		if ( !running ) return;
		Level.run();
		requestAnimationFrame( run );
	}

	onMount( async () =>
	{
		await TexturePool.preload();
		
		const { innerWidth: iw, innerHeight: ih } = window;
		renderer.setSize( iw, ih );
		Level.init( renderer, new PerspectiveCamera( 90, iw/ih, 0.1, 1000 ));
		Level.load( loadLevel1() );
		container.appendChild( canvas );
		Level.render();
	});
</script>

<main>
	<div id="termagic" bind:this={container}/>
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}

	#termagic {
		margin: 0;
	}
</style>