import { createFakeCard, createFakeCardData, createFakeHand } from "../../src/functions/debugging";

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
			image: "https://deckofcardsapi.com/static/img/2H.png",
			point: 2,
			suit: "HEARTS",
			value: "2",
		});
	});

	it("creates face card object", () => {
		const fakeCard = createFakeCard("JD");
		expect(fakeCard).toEqual({
			code: "JD",
			image: "https://deckofcardsapi.com/static/img/JD.png",
			point: 10,
			suit: "DIAMONDS",
			value: "JACK",
		});
	});

	it("creates ace card object", () => {
		const fakeCard = createFakeCard("AC");
		expect(fakeCard).toEqual({
			code: "AC",
			image: "https://deckofcardsapi.com/static/img/AC.png",
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