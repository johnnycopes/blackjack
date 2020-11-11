import type { IAppConfig } from "../models/interfaces/app-config.interface";
import { imageStrategyOnDemand } from "../functions/images";

export const appConfig: IAppConfig = {
	imageStrategy: imageStrategyOnDemand,
	waitForAnimations: true,
};