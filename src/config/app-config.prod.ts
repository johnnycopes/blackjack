import type { IAppConfig } from "../models/interfaces/app-config.interface";
import { EImageStrategy } from "../models/enums/image-strategy.enum";

export const appConfig: IAppConfig = {
	images: EImageStrategy.Preload,
	animations: true,
};