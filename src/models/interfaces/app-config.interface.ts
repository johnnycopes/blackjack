import type { EAppMode } from "../enums/app-mode.enum";

export interface IAppConfig {
	mode: EAppMode;
	images: Map<string, string>;
	animations: boolean;
}