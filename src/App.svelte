<script lang="ts">
	import { onMount } from 'svelte';
	import { PerspectiveCamera, WebGLRenderer } from 'three';
	import Level from './scripts/core/Level';
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
	}

	window.onmousemove = (ev: MouseEvent) => Level.events['cursor_move'].push({
		dx: ev.movementX,
		dy: ev.movementY
	});

	document.onpointerlockchange = () => { running = !!document.pointerLockElement };

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
		if ( !running )
			return;
		
		Level.run();

		requestAnimationFrame( () => run() );
	}

	onMount(() =>
	{
		const { innerWidth: iw, innerHeight: ih } = window;
		renderer.setSize( iw, ih );
		Level.init( renderer, new PerspectiveCamera( 90, iw/ih, 0.1, 1000 ));
		Level.load( loadLevel1() );
		container.appendChild( canvas );
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