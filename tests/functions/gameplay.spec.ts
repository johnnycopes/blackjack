import { EOutcome } from "../../src/models/enums/outcome.enum";
import type { IDeckData } from "../../src/models/api/deck-data.interface";
import type { IDrawData } from "../../src/models/api/draw-data.interface";
import type { IMoney } from "../../src/models/interfaces/money.interface";
import {
	createHand,
	fetchDeck,
	dealCardsFromDeck,
	drawCardFromDeck,
	addCardsToHand,
	evaluateBlackjack,
	evaluateOutcome,
	updateMoney,
} from "../../src/functions/gameplay";
import { createCard } from "../../src/functions/card";
import { createFakeCard, createFakeCardData } from "../../src/functions/debugging";
import fetchMock from "jest-fetch-mock";

describe("createHand", () => {
	it("creates new hand object", () => {
		const hand = createHand();
		expect(hand).toEqual({
			cards: [],
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

	it("returns a new, unshuffled deck", async () => {
		fetchMock.mockResponseOnce(JSON.stringify(mockResponseData));
		const deck = await fetchDeck();
		expect(deck).toEqual({
			id: "77cikknyaadb",
			remaining: 312,
		});
	});
});

describe("dealCardsFromDeck", () => {
	const card3Data = createFakeCardData("3H");
	const card8Data = createFakeCardData("8C");
	const cardKingData = createFakeCardData("KD");
	const cardAceData = createFakeCardData("AS");
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

	it("deals two cards to both player and dealer", async () => {
		fetchMock.mockResponseOnce(JSON.stringify(mockResponseData));
		const dealtCards = await dealCardsFromDeck("77cikknyaadb");
		expect(dealtCards).toEqual({
			player: [cardKing, card3],
			dealer: [cardAce, card8],
		});
	});
});

describe("drawCardFromDeck", () => {
	const card8Data = createFakeCardData("8C");
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

	it("draws a card from an existing deck", async () => {
		fetchMock.mockResponseOnce(JSON.stringify(mockResponseData));
		const card = await drawCardFromDeck("77cikknyaadb");
		expect(card).toEqual(card8);
	});
});

describe("addCardsToHand", () => {
	const hand = createHand();
	const card3 = createFakeCard("3H");
	const card8 = createFakeCard("8C");
	const cardKing = createFakeCard("KD");
	const cardAce = createFakeCard("AS");

	describe("dealt hand has no aces", () => {
		const dealtHand = addCardsToHand(hand, [card3, cardKing]);
		it("adds 3 and king to empty hand", () => {
			expect(dealtHand).toEqual({
				cards: [card3, cardKing],
				soft: false,
				total: 13
			});
		});
	
		it("adds 8 to existing hand", () => {
			const dealtHand = addCardsToHand(hand, [card3, cardKing]);
			const updatedHand = addCardsToHand(dealtHand, [card8]);
			expect(updatedHand).toEqual({
				cards: [card3, cardKing, card8],
				soft: false,
				total: 21
			});
		});
	
		it("adds ace to existing hand", () => {
			const dealtHand = addCardsToHand(hand, [card3, cardKing]);
			const updatedHand = addCardsToHand(dealtHand, [cardAce]);
			expect(updatedHand).toEqual({
				cards: [card3, cardKing, cardAce],
				soft: false,
				total: 14
			});
		});
	});

	describe("dealt hand has an ace", () => {
		const dealtHand = addCardsToHand(hand, [card8, cardAce]);
		it("adds 3 and ace to empty hand", () => {
			expect(dealtHand).toEqual({
				cards: [card8, cardAce],
				soft: true,
				total: 19
			});
		});
	
		it("adds king to existing hand", () => {
			const updatedHand = addCardsToHand(dealtHand, [cardKing]);
			expect(updatedHand).toEqual({
				cards: [card8, cardAce, cardKing],
				soft: false,
				total: 19
			});
		});

		it("adds ace to existing hand", () => {
			const updatedHand = addCardsToHand(dealtHand, [cardAce]);
			expect(updatedHand).toEqual({
				cards: [card8, cardAce, cardAce],
				soft: true,
				total: 20
			});
		});
	});
});

describe("evaluateBlackjack", () => {
	it("returns value if both player and dealer have 21", () => {
		const outcome = evaluateBlackjack(21, 21);
		expect(outcome).toEqual(EOutcome.Push);
	});

	it("returns value if only player has 21", () => {
		const outcome = evaluateBlackjack(21, 19);
		expect(outcome).toEqual(EOutcome.PlayerBlackjack);
	});

	it("returns value if only dealer has 21", () => {
		const outcome = evaluateBlackjack(15, 21);
		expect(outcome).toEqual(EOutcome.DealerBlackjack);
	});

	it("throws error if neither player nor dealer have 21", () => {
		const outcome = () => evaluateBlackjack(17, 18);
		expect(outcome).toThrow();
	});
});

describe("evaluateOutcome", () => {
	it("returns value if player busts", () => {
		const outcome = evaluateOutcome(23, 14);
		expect(outcome).toEqual(EOutcome.PlayerBusts);
	});

	it("returns value if dealer busts", () => {
		const outcome = evaluateOutcome(18, 22);
		expect(outcome).toEqual(EOutcome.DealerBusts);
	});

	it("returns value if player wins", () => {
		const outcome = evaluateOutcome(20, 19);
		expect(outcome).toEqual(EOutcome.PlayerWins);
	});

	it("returns value if dealer wins", () => {
		const outcome = evaluateOutcome(19, 20);
		expect(outcome).toEqual(EOutcome.DealerWins);
	});

	it("returns value if there's a push", () => {
		const outcome = evaluateOutcome(21, 21);
		expect(outcome).toEqual(EOutcome.Push);
	});
});

describe("updateMoney", () => {
	const money: IMoney = {
		bet: 100,
		total: 1000
	};
	
	it("adds 1.5x the bet amount to total if player gets blackjack", () => {
		const updatedMoney = updateMoney(money, EOutcome.PlayerBlackjack);
		expect(updatedMoney).toEqual({ bet: 0, total: 1150 });
	});

	it("adds the bet amount to total if player wins", () => {
		const updatedMoney = updateMoney(money, EOutcome.PlayerWins);
		expect(updatedMoney).toEqual({ bet: 0, total: 1100 });
	});

	it("adds the bet amount to total if dealer busts", () => {
		const updatedMoney = updateMoney(money, EOutcome.DealerBusts);
		expect(updatedMoney).toEqual({ bet: 0, total: 1100 });
	});

	it("subtracts the bet amount from total if player busts", () => {
		const updatedMoney = updateMoney(money, EOutcome.PlayerBusts);
		expect(updatedMoney).toEqual({ bet: 0, total: 900 });
	});

	it("subtracts the bet amount from total if dealer wins", () => {
		const updatedMoney = updateMoney(money, EOutcome.DealerWins);
		expect(updatedMoney).toEqual({ bet: 0, total: 900 });
	});

	it("subtracts the bet amount from total if dealer gets blackjack", () => {
		const updatedMoney = updateMoney(money, EOutcome.DealerBlackjack);
		expect(updatedMoney).toEqual({ bet: 0, total: 900 });
	});

	it("doesn't change the total if there's a push", () => {
		const updatedMoney = updateMoney(money, EOutcome.Push);
		expect(updatedMoney).toEqual({ bet: 0, total: 1000 });
	});
});