import type { IImage } from "../../src/models/interfaces/image.interface";
import { imageStrategyNone, imageStrategyOnDemand } from "../../src/functions/images";

const images: IImage[] = [
	{ name: "ACE_SPADES", src: "./assets/cards/ace_spades.png" }
];

describe("imageStrategyNone", () => {
	it("returns an empty map", async () => {
		const result = await imageStrategyNone(images);
		expect(result).toMatchObject(new Map<string, string>());
	});
});

describe("imageStrategyOnDemand", () => {
	it("returns a map of image names and their file paths", async () => {
		const result = await imageStrategyOnDemand(images);
		const expected = new Map();
		expected.set("ACE_SPADES", "./assets/cards/ace_spades.png");
		expect(result).toMatchObject(expected);
	});
});

/*
	NOTE: there's no test for imageStrategyPreload because the URL object
	is not supported in the js-dom library
*/
