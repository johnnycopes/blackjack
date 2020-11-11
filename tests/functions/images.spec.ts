// import fetchMock from "jest-fetch-mock";
import { IImage } from "../../src/models/interfaces/image.interface";
import {
	imageStrategyNone,
	imageStrategyOnDemand,
	// imageStrategyPreload
} from "../../src/functions/images";
	// import { preloadImage } from "../../src/functions/utility";

const images: IImage[] = [
	{ name: "ACE_SPADES", src: "./assets/cards/ace_spades.png" }
];

// beforeEach(() => {
// 	fetchMock.resetMocks();
// });

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

// describe("preloadImage", () => {
// 	it("works", async () => {
// 		const mockResponseData = {
// 			url: "https://blackjack-testing-wip.surge.sh/assets/cards/ace_spades.png"
// 		};
// 		fetchMock.mockResponseOnce(JSON.stringify(mockResponseData));

// 		const image = await preloadImage("./assets/cards/ace_spades.png");
// 		expect(image).toEqual(1);
// 	});
// });

// describe("imageStrategyPreload", () => {
// 	const mockResponseData = {
// 		url: "https://blackjack-testing-wip.surge.sh/assets/cards/ace_spades.png"
// 	};
// 	fetchMock.mockResponseOnce(JSON.stringify(mockResponseData));

// 	it("returns a map of image names and their blob URLs", async () => {
// 		const mockResponseData = {
// 			url: "https://blackjack-testing-wip.surge.sh/assets/cards/ace_spades.png"
// 		};
// 		fetchMock.mockResponseOnce(JSON.stringify(mockResponseData));

// 		const result = await imageStrategyPreload(images);
// 		const expected = new Map();
// 		expected.set("ACE_SPADES", "./assets/cards/ace_spades.png");
// 		expect(result).toMatchObject(expected);
// 	});
// });
