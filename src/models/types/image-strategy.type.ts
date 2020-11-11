import type { IImage } from "../interfaces/image.interface";

export type ImageStrategy = (images: IImage[]) => Promise<Map<string, string>>;