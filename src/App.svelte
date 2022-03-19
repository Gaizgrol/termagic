<script lang="ts">
	import { onMount } from 'svelte';
	import { PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { DEGTORAD } from './constants';
	
	import Player from './Player';
	import Wall from './Wall';

	const scene = new Scene();
	const renderer = new WebGLRenderer();
	const canvas = renderer.domElement;
	const wall1 = new Wall( 0xFFFFFF );
	const wall2 = new Wall( 0xFFFFFF );
	const wall3 = new Wall( 0xAFAFAF );
	const wall4 = new Wall( 0xAFAFAF );
	wall1.mesh.position.set( 0, 0, -5 );
	wall2.mesh.position.set( 0, 0, 5 );
	wall2.mesh.rotateOnAxis( new Vector3( 0, 1, 0 ), 180 * DEGTORAD );
	wall3.mesh.position.set( 5, 0, 0 );
	wall3.mesh.rotateOnAxis( new Vector3( 0, 1, 0 ), -90 * DEGTORAD );
	wall4.mesh.position.set( -5, 0, 0 );
	wall4.mesh.rotateOnAxis( new Vector3( 0, 1, 0 ), 90 * DEGTORAD );

	scene.add( wall1.mesh );
	scene.add( wall2.mesh );
	scene.add( wall3.mesh );
	scene.add( wall4.mesh );

	let container: HTMLDivElement;
	let running = false;
	let fv = 0;

	const player = new Player();

	window.onresize = () =>
	{
		const { innerWidth: iw, innerHeight: ih } = window;
		player.camera = new PerspectiveCamera( 90, iw/ih, 0.1, 1000 );
		renderer.setSize( iw, ih );
		renderer.render( scene, player.camera );
	}

	window.onmousemove = (ev: MouseEvent) =>
	{
		const { movementX: mx } = ev;
		player.rotate( -mx * 0.1 );
	}

	document.onpointerlockchange = () =>
	{
		running = !!document.pointerLockElement;
		draw( 0.016 );
	}

	canvas.onclick = () =>
	{
		canvas.requestPointerLock();
	}

	canvas.onmousedown = () =>
	{
		fv = 1;
	};

	canvas.onmouseup = () =>
	{
		fv = 0;
	};

	onMount(() =>
	{
		container.appendChild( canvas );
		window.onresize(null);
	});

	let lastFrame = Date.now();

	const draw = dt =>
	{
		if ( !running )
			return;

		lastFrame = Date.now();

		player.position = player.position.add( player.direction.multiplyScalar( fv * dt * 3 ) );

		renderer.render( scene, player.camera );
		requestAnimationFrame( () =>
		{
			dt = (Date.now() - lastFrame) / 1000;
			draw( dt )
		});
	}
	
	draw( 0.016 );
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