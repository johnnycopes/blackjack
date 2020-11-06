import { writable } from "svelte/store";

export const test_mode = writable(false);
export const cached_images = writable(new Map<string, string>());