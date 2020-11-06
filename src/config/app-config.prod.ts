import type { IAppConfig } from "../models/interfaces/app-config.interface";
import { EAppMode } from "../models/enums/app-mode.enum";

export const appConfig: IAppConfig = {
	mode: EAppMode.Prod,
	images: new Map(),
	animations: true,
};