<script lang="ts">
	import { onMount } from 'svelte';
	import { PerspectiveCamera, TextureLoader, WebGLRenderer } from 'three';
	import Level from './scripts/core/Level';
	import TexturePool from './scripts/core/TexturePool';
	import { loadLevel1 } from './scripts/helpers/constants';
	
	let container: HTMLDivElement;
	let gui: HTMLCanvasElement;

	const renderer = new WebGLRenderer();
	const canvas = renderer.domElement;
	
	let running = false;

	window.onresize = () =>
	{
		const { innerWidth: iw, innerHeight: ih } = window;
		gui.width = iw;
		gui.height = ih;
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

	const run = () =>
	{
		if ( !running ) return;
		Level.run();
		requestAnimationFrame( run );
	}

	onMount( async () =>
	{
		// Adiciona listener de eventos no container
		container.onclick = () =>
		{
			canvas.requestPointerLock();
			if ( !running )
			{
				running = true;
				run();
			}
		}

		// Carrega as texturas
		await TexturePool.preload();
		// Configura o tamanho da interface
		const { innerWidth: iw, innerHeight: ih } = window;
		gui.width = iw;
		gui.height = ih;
		// Configura o tamanho do renderizador
		renderer.setSize( iw, ih );

		// Carrega e inicia o nível
		Level.init( renderer, gui, new PerspectiveCamera( 90, iw/ih, 0.1, 1000 ));
		Level.load( loadLevel1() );
		container.appendChild( canvas );
		Level.render();
	});
</script>

<main>
	<div id="termagic" bind:this={container}>
		<canvas id="gui" bind:this={gui}></canvas>
		<!--canvas do jogo será inserido aqui-->
	</div>
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}

	#gui {
		position: absolute;
		z-index: 2;
	}

	#termagic {
		margin: 0;
		position: absolute;
		z-index: 1;
	}
</style>