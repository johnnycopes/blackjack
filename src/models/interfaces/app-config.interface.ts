import type { ImageStrategy } from "../../functions/images";

export interface IAppConfig {
	imageStrategy: ImageStrategy;
	waitForAnimations: boolean;
}