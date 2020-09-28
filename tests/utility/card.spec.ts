import { getValue, getSuit, getPoint, createCardData, createCard } from "../../src/utility/card";

describe("getValue", () => {
	test("returns a single-digit number", () => {
		const value = getValue("5S");
		expect(value).toEqual("5");
	})

	test("returns 10", () => {
		const value = getValue("0S");
		expect(value).toEqual("10");
	});

	test("returns jack", () => {
		const value = getValue("JS");
		expect(value).toEqual("JACK");
	});

	test("returns queen", () => {
		const value = getValue("QS");
		expect(value).toEqual("QUEEN");
	});

	test("returns king", () => {
		const value = getValue("KS");
		expect(value).toEqual("KING");
	});

	test("throws error on invalid argument", () => {
		const suit = () => getValue("1S" as any);
		expect(suit).toThrow(new Error("Invalid card code (not a valid value)"));
	});
});

describe("getSuit", () => {
	test("returns spades", () => {
		const suit = getSuit("9S");
		expect(suit).toEqual("SPADES");
	});

	test("returns diamonds", () => {
		const suit = getSuit("9D");
		expect(suit).toEqual("DIAMONDS");
	});

	test("returns clubs", () => {
		const suit = getSuit("9C");
		expect(suit).toEqual("CLUBS");
	});

	test("returns hearts", () => {
		const suit = getSuit("9H");
		expect(suit).toEqual("HEARTS");
	});

	test("throws error on invalid argument", () => {
		const suit = () => getSuit("9R" as any);
		expect(suit).toThrow(new Error("Invalid card code (not a valid suit)"));
	});
});

describe("getPoint", () => {
	test("returns ace", () => {
		const pointValue = getPoint("ACE");
		expect(pointValue).toEqual(11);
	});

	test("returns king", () => {
		const pointValue = getPoint("KING");
		expect(pointValue).toEqual(10);
	});

	test("returns queen", () => {
		const pointValue = getPoint("QUEEN");
		expect(pointValue).toEqual(10);
	});

	test("returns jack", () => {
		const pointValue = getPoint("JACK");
		expect(pointValue).toEqual(10);
	});

	test("returns number", () => {
		const pointValue = getPoint("7");
		expect(pointValue).toEqual(7);
	});
});

describe("createCardData", () => {
	test("creates number card data object", () => {
		const cardData = createCardData("3H");
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

	test("creates face card data object", () => {
		const cardData = createCardData("JC");
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

	test("creates ace card data object", () => {
		const cardData = createCardData("AD");
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

describe("createCard", () => {
	test("creates number card object", () => {
		const cardResponse = createCardData("8C");
		const card = createCard(cardResponse);
		expect(card).toEqual({
			code: "8C",
			image: "https://deckofcardsapi.com/static/img/8C.png",
			point: 8,
			suit: "CLUBS",
			value: "8",
		});
	});

	test("creates face card object", () => {
		const cardResponse = createCardData("KD");
		const card = createCard(cardResponse);
		expect(card).toEqual({
			code: "KD",
			image: "https://deckofcardsapi.com/static/img/KD.png",
			point: 10,
			suit: "DIAMONDS",
			value: "KING",
		});
	});

	test("creates ace card object", () => {
		const cardResponse = createCardData("AS");
		const card = createCard(cardResponse);
		expect(card).toEqual({
			code: "AS",
			image: "https://deckofcardsapi.com/static/img/AS.png",
			point: 11,
			suit: "SPADES",
			value: "ACE",
		});
	});
});