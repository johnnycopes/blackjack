import type { IDeck } from "../../src/models/interfaces/deck.interface";
import {
	createFakeCard,
	createFakeCardData,
	createFakeDeck,
	createFakeDeckData,
	createFakeHand,
	drawFromFakeDeck
} from "../../src/functions/debugging";

describe("createFakeCardData", () => {
	it("creates number card data object", () => {
		const cardData = createFakeCardData("3H");
		expect(cardData).toEqual({
			code: "3H",
			image: "https://deckofcardsapi.com/static/img/3H.png",
			images: {
				png: "https://deckofcardsapi.com/static/img/3H.png",
				svg: "https://deckofcardsapi.com/static/img/3H.svg",
			},
			suit: "HEARTS",
			value: "3",
		});
	});

	it("creates face card data object", () => {
		const cardData = createFakeCardData("JC");
		expect(cardData).toEqual({
			code: "JC",
			image: "https://deckofcardsapi.com/static/img/JC.png",
			images: {
				png: "https://deckofcardsapi.com/static/img/JC.png",
				svg: "https://deckofcardsapi.com/static/img/JC.svg",
			},
			suit: "CLUBS",
			value: "JACK",
		});
	});

	it("creates ace card data object", () => {
		const cardData = createFakeCardData("AD");
		expect(cardData).toEqual({
			code: "AD",
			image: "https://deckofcardsapi.com/static/img/AD.png",
			images: {
				png: "https://deckofcardsapi.com/static/img/AD.png",
				svg: "https://deckofcardsapi.com/static/img/AD.svg",
			},
			suit: "DIAMONDS",
			value: "ACE",
		});
	});
});

describe("createFakeCard", () => {
	it("creates number card object", () => {
		const fakeCard = createFakeCard("2H");
		expect(fakeCard).toEqual({
			code: "2H",
			point: 2,
			suit: "HEARTS",
			value: "2",
		});
	});

	it("creates face card object", () => {
		const fakeCard = createFakeCard("JD");
		expect(fakeCard).toEqual({
			code: "JD",
			point: 10,
			suit: "DIAMONDS",
			value: "JACK",
		});
	});

	it("creates ace card object", () => {
		const fakeCard = createFakeCard("AC");
		expect(fakeCard).toEqual({
			code: "AC",
			point: 11,
			suit: "CLUBS",
			value: "ACE",
		});
	});
});

describe("createFakeHand", () => {
	it("creates hand object with no cards", () => {
		const fakeHand = createFakeHand();
		expect(fakeHand).toEqual({
			cards: [],
			total: 0,
			soft: false
		});
	});

	it("creates hand object with one card", () => {
		const fakeHand = createFakeHand("6H");
		expect(fakeHand).toEqual({
			cards: [ createFakeCard("6H") ],
			total: 6,
			soft: false
		});
	});

	it("creates hand object with multiple cards", () => {
		const fakeHand = createFakeHand("6H", "8D", "4C", "AH");
		expect(fakeHand).toEqual({
			cards: [
				createFakeCard("6H"),
				createFakeCard("8D"),
				createFakeCard("4C"),
				createFakeCard("AH")
			],
			total: 19,
			soft: false
		});
	});
});

describe("createFakeDeckData", () => {
	it("creates deck data object when passed", () => {
		const fakeDeckData = createFakeDeckData();
		expect(fakeDeckData).toEqual({
			deck_id: "77cikknyaadb",
			remaining: 312,
			shuffled: true,
			success: true,
		});
	});
});

describe("createFakeDrawData", () => {
	let fakeDeck: IDeck;

	beforeEach(() => {
		fakeDeck = createFakeDeck();
	});

	it("draws one card from deck", () => {
		const fakeDrawData = drawFromFakeDeck(fakeDeck, ["AS"]);
		expect(fakeDrawData).toEqual({
			success: true,
			deck_id: "77cikknyaadb",
			cards: [ createFakeCardData("AS") ],
			remaining: 311
		});
		expect(fakeDeck).toEqual({
			id: "77cikknyaadb",
			remaining: 311
		});
	});

	it("draws multiple cards from deck at once", () => {
		const fakeDrawData = drawFromFakeDeck(fakeDeck, ["AS", "5D", "0D", "5S"]);
		expect(fakeDrawData).toEqual({
			success: true,
			deck_id: "77cikknyaadb",
			cards: [
				createFakeCardData("AS"),
				createFakeCardData("5D"),
				createFakeCardData("0D"),
				createFakeCardData("5S"),
			],
			remaining: 308
		});
		expect(fakeDeck).toEqual({
			id: "77cikknyaadb",
			remaining: 308
		});
	});

	it("draws multiple cards from deck over time", () => {
		const fakeDrawData = drawFromFakeDeck(fakeDeck, ["AS", "5D"]);
		expect(fakeDrawData).toEqual({
			success: true,
			deck_id: "77cikknyaadb",
			cards: [ createFakeCardData("AS"), createFakeCardData("5D") ],
			remaining: 310
		});
		expect(fakeDeck).toEqual({
			id: "77cikknyaadb",
			remaining: 310
		});

		const moreFakeDrawData = drawFromFakeDeck(fakeDeck, ["0D"]);
		expect(moreFakeDrawData).toEqual({
			success: true,
			deck_id: "77cikknyaadb",
			cards: [ createFakeCardData("0D") ],
			remaining: 309
		});
		expect(fakeDeck).toEqual({
			id: "77cikknyaadb",
			remaining: 309
		});

		const evenMoreFakeDrawData = drawFromFakeDeck(fakeDeck, ["5S"]);
		expect(evenMoreFakeDrawData).toEqual({
			success: true,
			deck_id: "77cikknyaadb",
			cards: [ createFakeCardData("5S") ],
			remaining: 308
		});
		expect(fakeDeck).toEqual({
			id: "77cikknyaadb",
			remaining: 308
		});
	});
});
