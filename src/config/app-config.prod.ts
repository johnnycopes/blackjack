import type { IAppConfig } from "../models/interfaces/app-config.interface";
import { imageStrategyPreload } from "../functions/images";

export const appConfig: IAppConfig = {
	imageStrategy: imageStrategyPreload,
	waitForAnimations: true,
};