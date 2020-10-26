import fetchMock from "jest-fetch-mock";
import type { IDeckData } from "../../src/models/api/deck-data.interface";
import type { IDrawData } from "../../src/models/api/draw-data.interface";
import { EOutcome } from "../../src/models/enums/outcome.enum";
import {
	createHand,
	createDeck,
	fetchDeck,
	dealCardsFromDeck,
	drawCardFromDeck,
	addCardsToHand,
	evaluateBlackjack,
	evaluateOutcome,
	evaluateChipsToShow,
} from "../../src/functions/gameplay";
import { createCard } from "../../src/functions/card";
import { createFakeCard, createFakeCardData, createFakeDeckData } from "../../src/functions/debugging";

describe("createHand", () => {
	it("creates hand object", () => {
		const hand = createHand();
		expect(hand).toEqual({
			cards: [],
			total: 0,
			soft: false,
		});
	});
});

describe("createDeck", () => {
	it("creates deck object", () => {
		const deckData = createFakeDeckData();
		const deck = createDeck(deckData);
		expect(deck).toEqual({
			id: "77cikknyaadb",
			remaining: 312,
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
				total: 13,
				soft: false
			});
		});
	
		it("adds 8 to existing hand", () => {
			const dealtHand = addCardsToHand(hand, [card3, cardKing]);
			const updatedHand = addCardsToHand(dealtHand, [card8]);
			expect(updatedHand).toEqual({
				cards: [card3, cardKing, card8],
				total: 21,
				soft: false
			});
		});
	
		it("adds ace to existing hand", () => {
			const dealtHand = addCardsToHand(hand, [card3, cardKing]);
			const updatedHand = addCardsToHand(dealtHand, [cardAce]);
			expect(updatedHand).toEqual({
				cards: [card3, cardKing, cardAce],
				total: 14,
				soft: false
			});
		});
	});

	describe("dealt hand has an ace", () => {
		const dealtHand = addCardsToHand(hand, [card8, cardAce]);
		it("adds 3 and ace to empty hand", () => {
			expect(dealtHand).toEqual({
				cards: [card8, cardAce],
				total: 19,
				soft: true
			});
		});
	
		it("adds king to existing hand", () => {
			const updatedHand = addCardsToHand(dealtHand, [cardKing]);
			expect(updatedHand).toEqual({
				cards: [card8, cardAce, cardKing],
				total: 19,
				soft: false
			});
		});

		it("adds ace to existing hand", () => {
			const updatedHand = addCardsToHand(dealtHand, [cardAce]);
			expect(updatedHand).toEqual({
				cards: [card8, cardAce, cardAce],
				total: 20,
				soft: true
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

describe("evaluateChipsToShow", () => {
	it("value is $0", () => {
		const chips = evaluateChipsToShow(0);
		expect(chips).toEqual([]);
	});

	it("value is $6", () => {
		const chips = evaluateChipsToShow(6);
		expect(chips).toEqual([1, 5]);
	});

	it("value is $23", () => {
		const chips = evaluateChipsToShow(23);
		expect(chips).toEqual([1, 5, 10]);
	});

	it("value is $49", () => {
		const chips = evaluateChipsToShow(49);
		expect(chips).toEqual([1, 5, 10, 25]);
	});

	it("value is $87", () => {
		const chips = evaluateChipsToShow(87);
		expect(chips).toEqual([1, 5, 10, 25, 50]);
	});

	it("value is $103", () => {
		const chips = evaluateChipsToShow(103);
		expect(chips).toEqual([1, 5, 10, 25, 50, 100]);
	});
});