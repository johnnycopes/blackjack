import { EOutcome } from "../src/models/enums/outcome.enum";
import type { IDeckData } from "../src/models/api/deck-data.interface";
import type { IDrawData } from "../src/models/api/draw-data.interface";
import type { IMoney } from "../src/models/interfaces/money.interface";
import {
createCard,
createHand,
getCardPoint,
fetchDeck,
dealCardsFromDeck,
drawCardFromDeck,
addCardsToHand,
checkForBlackjacks,
evaluateOutcome,
updateMoney,
} from "../src/utility/gameplay";
import { createCardData } from "../src/utility/debugging";
import fetchMock from "jest-fetch-mock";

const card3Data = createCardData("3H");
const card8Data = createCardData("8C");
const cardKingData = createCardData("KD");
const cardAceData = createCardData("AS");
const card3 = createCard(card3Data);
const card8 = createCard(card8Data);
const cardKing = createCard(cardKingData);
const cardAce = createCard(cardAceData);

describe("getCardPoint", () => {
	test("is ace", () => {
		const pointValue = getCardPoint("ACE");
		expect(pointValue).toEqual(11);
	});

	test("is king", () => {
		const pointValue = getCardPoint("KING");
		expect(pointValue).toEqual(10);
	});

	test("is queen", () => {
		const pointValue = getCardPoint("QUEEN");
		expect(pointValue).toEqual(10);
	});

	test("is jack", () => {
		const pointValue = getCardPoint("JACK");
		expect(pointValue).toEqual(10);
	});

	test("is number", () => {
		const pointValue = getCardPoint("7");
		expect(pointValue).toEqual(7);
	});
});

describe("createCard", () => {
	test("creates new number card object", () => {
		const cardResponse = card8Data;
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
		const cardResponse = cardKingData;
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
		const cardResponse = cardAceData;
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

describe("fetchDeck", () => {
	beforeEach(() => {
		fetchMock.resetMocks();
	});
	
	const mockResponseData: IDeckData = {
		deck_id: "77cikknyaadb",
		remaining: 312,
		shuffled: true,
		success: true,
	};

	test("returns a new, unshuffled deck", async () => {
		fetchMock.mockResponseOnce(JSON.stringify(mockResponseData));
		const deck = await fetchDeck();
		expect(deck).toEqual({
			id: "77cikknyaadb",
			remaining: 312,
		});
	});
});

describe("dealCardsFromDeck", () => {
	beforeEach(() => {
		fetchMock.resetMocks();
	});

	const mockResponseData: IDrawData = {
		cards: [
			cardKingData,
			cardAceData,
			card3Data,
			card8Data
		],
		deck_id: "77cikknyaadb",
		remaining: 308,
		success: true
	};
	test("player and dealer are dealt two cards each from an existing deck", async () => {
		fetchMock.mockResponseOnce(JSON.stringify(mockResponseData));
		const dealtCards = await dealCardsFromDeck("77cikknyaadb");
		expect(dealtCards).toEqual({
			player: [cardKing, card3],
			dealer: [cardAce, card8],
		});
	});
});

describe("drawCardFromDeck", () => {
	beforeEach(() => {
		fetchMock.resetMocks();
	});

	const mockResponseData: IDrawData = {
		cards: [card8Data],
		deck_id: "77cikknyaadb",
		remaining: 311,
		success: true
	};

	test("draw a card from an existing deck", async () => {
		fetchMock.mockResponseOnce(JSON.stringify(mockResponseData));
		const card = await drawCardFromDeck("77cikknyaadb");
		expect(card).toEqual(card8);
	});
});

describe("addCardsToHand", () => {
	const hand = createHand(false);
	const dealtHand = addCardsToHand(hand, [card3, cardKing]);

	test("adds 3 and king to empty hand", () => {
		expect(dealtHand).toEqual({
			cards: [card3, cardKing],
			hidden: false,
			soft: false,
			total: 13
		});
	});

	test("adds 8 to existing hand", () => {
		const dealtHand = addCardsToHand(hand, [card3, cardKing]);
		const updatedHand = addCardsToHand(dealtHand, [card8]);
		expect(updatedHand).toEqual({
			cards: [card3, cardKing, card8],
			hidden: false,
			soft: false,
			total: 21
		});
	});

	test("adds ace to existing hand", () => {
		const dealtHand = addCardsToHand(hand, [card3, cardKing]);
		const updatedHand = addCardsToHand(dealtHand, [cardAce]);
		expect(updatedHand).toEqual({
			cards: [card3, cardKing, cardAce],
			hidden: false,
			soft: false,
			total: 14
		});
	});

	test("adds 3 and ace to empty hand", () => {
		const dealtHand = addCardsToHand(hand, [card8, cardAce]);
		expect(dealtHand).toEqual({
			cards: [card8, cardAce],
			hidden: false,
			soft: true,
			total: 19
		});
	});

	test("adds king to existing hand", () => {
		const dealtHand = addCardsToHand(hand, [card8, cardAce]);
		const updatedHand = addCardsToHand(dealtHand, [cardKing]);
		expect(updatedHand).toEqual({
			cards: [card8, cardAce, cardKing],
			hidden: false,
			soft: false,
			total: 19
		});
	});
});

describe("checkForBlackjacks", () => {
	test("player and dealer both get blackjack", () => {
		const outcome = checkForBlackjacks(21, 21);
		expect(outcome).toEqual(EOutcome.Push);
	});

	test("player gets blackjack", () => {
		const outcome = checkForBlackjacks(21, 19);
		expect(outcome).toEqual(EOutcome.PlayerBlackjack);
	});

	test("dealer gets blackjack", () => {
		const outcome = checkForBlackjacks(15, 21);
		expect(outcome).toEqual(EOutcome.DealerBlackjack);
	});

	test("no blackjacks dealt", () => {
		const outcome = checkForBlackjacks(10, 13);
		expect(outcome).toEqual(undefined);
	});
});

describe("evaluateOutcome", () => {
	test("dealer busts", () => {
		const outcome = evaluateOutcome(18, 22);
		expect(outcome).toEqual(EOutcome.DealerBusts);
	});

	test("player wins", () => {
		const outcome = evaluateOutcome(20, 19);
		expect(outcome).toEqual(EOutcome.PlayerWins);
	});

	test("dealer wins", () => {
		const outcome = evaluateOutcome(19, 20);
		expect(outcome).toEqual(EOutcome.DealerWins);
	});

	test("push", () => {
		const outcome = evaluateOutcome(21, 21);
		expect(outcome).toEqual(EOutcome.Push);
	});
});

describe("updateMoney", () => {
	const money: IMoney = {
		bet: 100,
		total: 1000
	};
	test("player gets blackjack", () => {
		const updatedMoney = updateMoney(money, EOutcome.PlayerBlackjack);
		expect(updatedMoney).toEqual({ bet: 0, total: 1150 });
	});

	test("player wins", () => {
		const updatedMoney = updateMoney(money, EOutcome.PlayerWins);
		expect(updatedMoney).toEqual({ bet: 0, total: 1100 });
	});

	test("dealer busts", () => {
		const updatedMoney = updateMoney(money, EOutcome.DealerBusts);
		expect(updatedMoney).toEqual({ bet: 0, total: 1100 });
	});

	test("player busts", () => {
		const updatedMoney = updateMoney(money, EOutcome.PlayerBusts);
		expect(updatedMoney).toEqual({ bet: 0, total: 900 });
	});

	test("dealer wins", () => {
		const updatedMoney = updateMoney(money, EOutcome.DealerWins);
		expect(updatedMoney).toEqual({ bet: 0, total: 900 });
	});

	test("dealer gets blackjack", () => {
		const updatedMoney = updateMoney(money, EOutcome.DealerBlackjack);
		expect(updatedMoney).toEqual({ bet: 0, total: 900 });
	});

	test("push", () => {
		const updatedMoney = updateMoney(money, EOutcome.Push);
		expect(updatedMoney).toEqual({ bet: 0, total: 1000 });
	});
});