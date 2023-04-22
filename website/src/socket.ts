import io from 'socket.io-client';
import { get } from 'svelte/store';
import { mice, render, trails } from './store';

const socket = io(location.hostname == "localhost" ? "http://localhost:8080" : "/");

socket.on("message", (data)=>{
    console.log(data);
});

socket.on("trail", ({ name, trail }: { name: string, trail: Pos[] })=>{
    mice.update((v)=>{
        if (v[name] == undefined) {
            v[name] = {
                x: Math.random() * 1920,
                y: Math.random() * 1080,
                name
            }
        }
        return v;
    });
    trails.update((v)=>{
        if (!Array.isArray(v[name]))
            v[name] ??= trail;
        else {
            if (v[name].length < 100)
                v[name].push(...trail.reverse());
            else
                v[name] = trail.reverse();
        }

        return v;
    });
});

socket.on("leave", ({ name }: { name: string })=>{
    trails.update((v)=>(
        delete v[name],
        v
    ));
    mice.update((v)=>(
        delete v[name],
        v
    ));

    get(render)();
});

socket.on("join", ({ name }: { name: string })=>{
    mice.update((v)=>{
        v[name] = {
            x: Math.random() * 1920,
            y: Math.random() * 1080,
            name
        };
        return v;
    });

    get(render)();
});

export function disconnect() {
    socket.disconnect();
}

export function emitTrail(name: string, trail: Pos[]) {
    socket.emit("move", { name, trail });
}

export default socket;