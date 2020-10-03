import type { IDrawData } from "../models/api/draw-data.interface";
import type { IDeckData } from "../models/api/deck-data.interface";
import type { IDeck } from "../models/interfaces/deck.interface";
import type { IHand } from "../models/interfaces/hand.interface";
import type { ICard } from "../models/interfaces/card.interface";
import type { IMoney } from "../models/interfaces/money.interface";
import { EOutcome } from "../models/enums/outcome.enum";
import { API_URL } from "../models/constants";
import { createCard } from "./card";

interface IDealtCards {
	player: ICard[];
	dealer: ICard[];
}

export function createHand(): IHand {
	return {
		cards: [],
		total: 0,
		soft: false,
	};
}

export async function fetchDeck(): Promise<IDeck> {
	const response = await fetch(`${API_URL}/new/shuffle/?deck_count=6`);
	const data: IDeckData = await response.json();
	return {
		id: data.deck_id,
		remaining: data.remaining,
	};
}

export async function dealCardsFromDeck(deckId: string | undefined): Promise<IDealtCards> {
	if (deckId === undefined) {
		throw new Error("deckId is undefined");
	}
	const response = await fetch(`${API_URL}/${deckId}/draw/?count=4`);
	const data: IDrawData = await response.json();
	const dealtCards: IDealtCards = { player: [], dealer: [] };
	data.cards.forEach((cardResponse, index) => {
		const newCard = createCard(cardResponse);
		if ((index + 1) % 2 === 0) {
			dealtCards.dealer.push(newCard);
		} else {
			dealtCards.player.push(newCard);
		}
	});
	return dealtCards;
}

export async function drawCardFromDeck(deckId: string | undefined): Promise<ICard> {
	if (deckId === undefined) {
		throw new Error("deckId is undefined");
	}
	const response = await fetch(`${API_URL}/${deckId}/draw/?count=1`);
	const data: IDrawData = await response.json();
	return createCard(data.cards[0]);
}

export function addCardsToHand(hand: IHand, newCards: ICard[]): IHand {
	const cards = [...hand.cards, ...newCards];
	let numberOfAces = cards.filter(card => card.value === "ACE").length;
	let total = cards.reduce((total, card) => total + card.point, 0);
	while (total > 21 && numberOfAces > 0) {
		total -= 10;
		numberOfAces--;
	}
	const soft = !!numberOfAces;
	return { cards, total, soft };
}

export function evaluateBlackjack(playerTotal: number, dealerTotal: number): EOutcome {
	if (playerTotal === 21 && dealerTotal === 21) {
		return EOutcome.Push;
	} else if (playerTotal === 21) {
		return EOutcome.PlayerBlackjack;
	} else if (dealerTotal === 21) {
		return EOutcome.DealerBlackjack;
	}
	throw new Error("This function should only be called if either (or both) player/dealer are dealt 21");
}

export function evaluateOutcome(playerTotal: number, dealerTotal: number): EOutcome {
	if (playerTotal > 21) {
		return EOutcome.PlayerBusts;
	} else if (dealerTotal > 21) {
		return EOutcome.DealerBusts
	} else if (playerTotal > dealerTotal) {
		return EOutcome.PlayerWins;
	} else if (playerTotal < dealerTotal) {
		return EOutcome.DealerWins;
	} else {
		return EOutcome.Push;
	}
}

export function updateMoney(money: IMoney, outcome: EOutcome): IMoney {
	const { bet, total } = money;
	switch (outcome) {
		case (EOutcome.PlayerBlackjack):
			return { bet: 0, total: total + (bet * 1.5) };
		case (EOutcome.PlayerWins):
		case (EOutcome.DealerBusts):
			return { bet: 0, total: total + bet };
		case (EOutcome.PlayerBusts):
		case (EOutcome.DealerBlackjack):
		case (EOutcome.DealerWins):
			return { bet: 0, total: total - bet };
		default:
			return { bet: 0, total };
	}
}
