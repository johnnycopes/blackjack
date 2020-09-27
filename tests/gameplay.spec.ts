import { EOutcome } from "../src/models/enums/outcome.enum";
import type { IDeckData } from "../src/models/api/deck-data.interface";
import type { IDrawData } from "../src/models/api/draw-data.interface";
import type { IMoney } from "../src/models/interfaces/money.interface";
import {
	createHand,
	fetchDeck,
	dealCardsFromDeck,
	drawCardFromDeck,
	addCardsToHand,
	checkForBlackjacks,
	evaluateOutcome,
	updateMoney,
} from "../src/utility/gameplay";
import { createCard, createCardData } from "../src/utility/card";
import fetchMock from "jest-fetch-mock";

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
	const mockResponseData: IDeckData = {
		deck_id: "77cikknyaadb",
		remaining: 312,
		shuffled: true,
		success: true,
	};

	beforeEach(() => {
		fetchMock.resetMocks();
	});

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
	const card3Data = createCardData("3H");
	const card8Data = createCardData("8C");
	const cardKingData = createCardData("KD");
	const cardAceData = createCardData("AS");
	const card3 = createCard(card3Data);
	const card8 = createCard(card8Data);
	const cardKing = createCard(cardKingData);
	const cardAce = createCard(cardAceData);
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

	beforeEach(() => {
		fetchMock.resetMocks();
	});

	test("player and dealer are dealt two cards each", async () => {
		fetchMock.mockResponseOnce(JSON.stringify(mockResponseData));
		const dealtCards = await dealCardsFromDeck("77cikknyaadb");
		expect(dealtCards).toEqual({
			player: [cardKing, card3],
			dealer: [cardAce, card8],
		});
	});
});

describe("drawCardFromDeck", () => {
	const card8Data = createCardData("8C");
	const card8 = createCard(card8Data);
	const mockResponseData: IDrawData = {
		cards: [card8Data],
		deck_id: "77cikknyaadb",
		remaining: 311,
		success: true
	};

	beforeEach(() => {
		fetchMock.resetMocks();
	});

	test("draw a card from an existing deck", async () => {
		fetchMock.mockResponseOnce(JSON.stringify(mockResponseData));
		const card = await drawCardFromDeck("77cikknyaadb");
		expect(card).toEqual(card8);
	});
});

describe("addCardsToHand", () => {
	const hand = createHand(false);
	const card3Data = createCardData("3H");
	const card8Data = createCardData("8C");
	const cardKingData = createCardData("KD");
	const cardAceData = createCardData("AS");
	const card3 = createCard(card3Data);
	const card8 = createCard(card8Data);
	const cardKing = createCard(cardKingData);
	const cardAce = createCard(cardAceData);

	describe("dealt hand has no aces", () => {
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
	});

	describe("dealt hand has an ace", () => {
		const dealtHand = addCardsToHand(hand, [card8, cardAce]);
		test("adds 3 and ace to empty hand", () => {
			expect(dealtHand).toEqual({
				cards: [card8, cardAce],
				hidden: false,
				soft: true,
				total: 19
			});
		});
	
		test("adds king to existing hand", () => {
			const updatedHand = addCardsToHand(dealtHand, [cardKing]);
			expect(updatedHand).toEqual({
				cards: [card8, cardAce, cardKing],
				hidden: false,
				soft: false,
				total: 19
			});
		});

		test("adds ace to existing hand", () => {
			const updatedHand = addCardsToHand(dealtHand, [cardAce]);
			expect(updatedHand).toEqual({
				cards: [card8, cardAce, cardAce],
				hidden: false,
				soft: true,
				total: 20
			});
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