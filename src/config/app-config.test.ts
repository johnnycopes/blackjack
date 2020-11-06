import type { IAppConfig } from "../models/interfaces/app-config.interface";
import { EAppMode } from "../models/enums/app-mode.enum";

export const appConfig: IAppConfig = {
	mode: EAppMode.Test,
	images: new Map(),
	animations: false,
};