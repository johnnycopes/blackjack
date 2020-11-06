import { EAppMode } from "../models/enums/app-mode.enum";
import type { IAppConfig } from "../models/interfaces/app-config.interface";

export const appConfig: IAppConfig = {
	mode: EAppMode.Dev,
	images: new Map(),
	animations: true,
};