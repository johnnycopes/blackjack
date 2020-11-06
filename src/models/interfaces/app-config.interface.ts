import type { EImageStrategy } from "../enums/image-strategy.enum";

export interface IAppConfig {
	imageStrategy: EImageStrategy;
	waitForAnimations: boolean;
}