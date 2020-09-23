import {
	createCard,
  createHand,
  fetchDeck,
  dealCardsFromDeck,
  drawCardFromDeck,
  addCardsToHand,
  checkForBlackjacks,
  evaluateOutcome,
  updateMoney,
} from "../src/utility/gameplay";
import {
	ACE_CARD_RESPONSE_DATA,
	FACE_CARD_RESPONSE_DATA,
	NUMBER_CARD_RESPONSE_DATA
} from "./constants.spec";

describe("createCard", () => {
	test("creates new number card object", () => {
		const cardResponse = NUMBER_CARD_RESPONSE_DATA;
		const card = createCard(cardResponse);
		expect(card).toEqual({
			code: "8C",
			image: "https://deckofcardsapi.com/static/img/8C.png",
			point: 8,
			suit: "CLUBS",
			value: "8",
		});
	});

	test("creates new face card object", () => {
		const cardResponse = FACE_CARD_RESPONSE_DATA;
		const card = createCard(cardResponse);
		expect(card).toEqual({
			code: "KD",
			image: "https://deckofcardsapi.com/static/img/KD.png",
			point: 10,
			suit: "DIAMONDS",
			value: "KING",
		});
	});
	
	test("creates new ace card object", () => {
		const cardResponse = ACE_CARD_RESPONSE_DATA;
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

describe("createHand", () => {
	test("creates new player hand object", () => {
		const hand = createHand(false);
		expect(hand).toEqual({
			cards: [],
			hidden: false,
			soft: false,
			total: 0
		});
	});
	
	test("creates new dealer hand object", () => {
		const hand = createHand(true);
		expect(hand).toEqual({
			cards: [],
			hidden: true,
			soft: false,
			total: 0
		});
	});
});
