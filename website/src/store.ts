import { writable } from "svelte/store";

export const mice = writable<{[uid: string]: Mouse}>({});
export const trails = writable<Trails>({});
export const scale = writable(1);

export const uid = btoa(Math.random().toString()).slice(-5);