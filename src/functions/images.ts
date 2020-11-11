import type { IImage } from "../models/interfaces/image.interface";
import type { ImageStrategy } from "../models/types/image-strategy.type";
import { preloadImage } from "./utility";

export const imageStrategyNone: ImageStrategy = async () => new Map<string, string>();

export const imageStrategyOnDemand: ImageStrategy = async (images: IImage[]): Promise<Map<string, string>> => {
	const imagesMap = new Map<string, string>();
	for (const image of images) {
		const { name, src } = image;
		imagesMap.set(name, src);
	}
	return imagesMap;
}

export const imageStrategyPreload: ImageStrategy = async (images: IImage[]): Promise<Map<string, string>> => {
	const imagesMap = new Map<string, string>();
	const imageBlobURLs = await Promise.all(images.map(image => preloadImage(image.src)));
	for (let i = 0; i < images.length; i++) {
		const name = images[i].name;
		const blobURL = imageBlobURLs[i];
		imagesMap.set(name, blobURL);
	}
	return imagesMap;
}