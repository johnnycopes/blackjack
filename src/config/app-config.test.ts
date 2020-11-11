import type { IAppConfig } from "../models/interfaces/app-config.interface";
import { imageStrategyNone } from "../functions/images";

export const appConfig: IAppConfig = {
	imageStrategy: imageStrategyNone,
	waitForAnimations: false,
};