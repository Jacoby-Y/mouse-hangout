<script>
    import { onMount } from "svelte";
    import Canvas from "./lib/Canvas.svelte";
    import { scale } from "./store";
    import _socket, { disconnect } from "./socket";
    import Hud from "./lib/HUD.svelte";

    let main;

    onMount(()=>{
        window.onresize(null);
    });
    window.onresize = ()=>{
        const w = document.body.clientWidth;
        const h = document.body.clientHeight;
        if (w*(1080/1920) >= h) $scale = h/1080;
        else $scale = w/1920;
        
        main.style.transform = `translate(-50%, -50%) scale(${$scale}, ${$scale})`;
    }

    onunload = disconnect;

</script>

<main bind:this={main}>
    <Canvas />
    <Hud />
</main>

<style>
    main {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 1920px;
        height: 1080px;
        overflow: hidden;
        background-color: #1D222E;
    }
</style>