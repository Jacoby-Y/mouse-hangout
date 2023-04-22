<script lang="ts">
    import { onMount } from "svelte";
    import { mice, scale, trails, uid, render as renderMice } from "../store";
    import CursorSrc from "../assets/cursor.png";
    import { emitTrail } from "../socket";

    let cursorImg = new Image();
    cursorImg.src = CursorSrc;

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;

    const my_trail: Pos[] = [];

    onMount(()=>{
        canvas.width = 1920;
        canvas.height = 1080;

        ctx = canvas.getContext("2d");

        canvas.onmousemove = (ev)=>{
            //@ts-ignore
            const [x, y] = [ev.offsetX || ev.layerX, ev.offsetY || ev.layerY];

            my_trail.push({ x, y });
        }

        ctx.fillStyle = "purple";
        ctx.fillRect(10, 10, 10, 10);

        setInterval(()=>{
            if (my_trail.length == 0) return;
            emitTrail(uid, my_trail);
            my_trail.splice(0, my_trail.length);
        }, 500);

        requestAnimationFrame(function loop(){
            render();
            requestAnimationFrame(loop);
        });
    });

    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // console.log("Clear!");
    }

    let to_clear = false;
    function render() {
        if (canvas == null) return;

        if (to_clear) {
            to_clear = false;
            clear();
        }
        
        for (const key in $mice) {
            const { name, x, y } = $mice[key];

            if (($trails[name] ??= [])?.length ?? 0 > 0) {
                const new_pos = $trails[name].pop();
                $mice[key].x = new_pos.x;
                $mice[key].y = new_pos.y;

                // console.log(new_pos.x + ", " + new_pos.y);

                to_clear = true;
            }

            ctx.drawImage(cursorImg, x, y, 11*1.3 / $scale, 17*1.3 / $scale);
        }
    }

    $renderMice = render;

</script>

<canvas bind:this={canvas}></canvas>

<style>
    canvas {
        image-rendering: crisp-edges;
    }
</style>
