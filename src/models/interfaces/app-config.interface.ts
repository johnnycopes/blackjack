import type { ImageStrategy } from "../types/image-strategy.type";

export interface IAppConfig {
	imageStrategy: ImageStrategy;
	waitForAnimations: boolean;
}