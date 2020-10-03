import {
	getValue,
	getSuit,
	getPoint,
	createCard,
} from "../../src/functions/card";
import { createFakeCardData } from "../../src/functions/debugging";

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
