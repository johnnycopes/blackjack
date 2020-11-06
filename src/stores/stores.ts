import { writable } from "svelte/store";
import { EAppMode } from "../models/enums/app-mode.enum";

export const app_mode = writable(EAppMode.Dev);
export const cached_images = writable(new Map<string, string>());