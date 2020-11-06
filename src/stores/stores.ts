import { writable } from "svelte/store";

export const cached_images = writable(new Map<string, string>());