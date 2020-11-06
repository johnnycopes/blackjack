import type { EImageStrategy } from "../enums/image-strategy.enum";

export interface IAppConfig {
	images: EImageStrategy;
	animations: boolean;
}