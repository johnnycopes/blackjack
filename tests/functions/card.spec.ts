import {
	getValue,
	getSuit,
	getPoint,
	createCard,
	createFakeCardData,
	createFakeCard
} from "../../src/functions/card";

describe("getValue", () => {
	it("returns a single-digit number", () => {
		const value = getValue("5S");
		expect(value).toEqual("5");
	})

	it("returns 10", () => {
		const value = getValue("0S");
		expect(value).toEqual("10");
	});

	it("returns jack", () => {
		const value = getValue("JS");
		expect(value).toEqual("JACK");
	});

	it("returns queen", () => {
		const value = getValue("QS");
		expect(value).toEqual("QUEEN");
	});

	it("returns king", () => {
		const value = getValue("KS");
		expect(value).toEqual("KING");
	});

	it("throws error on invalid argument", () => {
		const suit = () => getValue("1S" as any);
		expect(suit).toThrow();
	});
});

describe("getSuit", () => {
	it("returns spades", () => {
		const suit = getSuit("9S");
		expect(suit).toEqual("SPADES");
	});

	it("returns diamonds", () => {
		const suit = getSuit("9D");
		expect(suit).toEqual("DIAMONDS");
	});

	it("returns clubs", () => {
		const suit = getSuit("9C");
		expect(suit).toEqual("CLUBS");
	});

	it("returns hearts", () => {
		const suit = getSuit("9H");
		expect(suit).toEqual("HEARTS");
	});

	it("throws error on invalid argument", () => {
		const suit = () => getSuit("9R" as any);
		expect(suit).toThrow();
	});
});

describe("getPoint", () => {
	it("returns ace", () => {
		const pointValue = getPoint("ACE");
		expect(pointValue).toEqual(11);
	});

	it("returns king", () => {
		const pointValue = getPoint("KING");
		expect(pointValue).toEqual(10);
	});

	it("returns queen", () => {
		const pointValue = getPoint("QUEEN");
		expect(pointValue).toEqual(10);
	});

	it("returns jack", () => {
		const pointValue = getPoint("JACK");
		expect(pointValue).toEqual(10);
	});

	it("returns number", () => {
		const pointValue = getPoint("7");
		expect(pointValue).toEqual(7);
	});
});

describe("createCard", () => {
	it("creates number card object", () => {
		const cardResponse = createFakeCardData("8C");
		const card = createCard(cardResponse);
		expect(card).toEqual({
			code: "8C",
			image: "https://deckofcardsapi.com/static/img/8C.png",
			point: 8,
			suit: "CLUBS",
			value: "8",
		});
	});

	it("creates face card object", () => {
		const cardResponse = createFakeCardData("KD");
		const card = createCard(cardResponse);
		expect(card).toEqual({
			code: "KD",
			image: "https://deckofcardsapi.com/static/img/KD.png",
			point: 10,
			suit: "DIAMONDS",
			value: "KING",
		});
	});

	it("creates ace card object", () => {
		const cardResponse = createFakeCardData("AS");
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