import type { IDrawData } from "../models/api/draw-data.interface";
import type { IDeckData } from "../models/api/deck-data.interface";
import type { ICardData } from "../models/api/card-data.interface";
import type { IDeck } from "../models/interfaces/deck.interface";
import type { IHand } from "../models/interfaces/hand.interface";
import type { ICard } from "../models/interfaces/card.interface";
import type { CardValue } from "../models/types/card-value";
import type { IMoney } from "../models/interfaces/money.interface";
import { EOutcome } from "../models/enums/outcome.enum";
import { API_URL } from "../models/constants";

interface IDealtCards {
	player: ICard[];
	dealer: ICard[];
}

export function createHand(hidden: boolean): IHand {
	return {
		cards: [],
		total: 0,
		hidden,
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
	const hidden = hand.hidden;
	return { cards, total, hidden, soft };
}

export function checkForBlackjacks(playerTotal: number, dealerTotal: number): EOutcome | undefined {
	if (playerTotal === 21 && dealerTotal === 21) {
		return EOutcome.Push;
	} else if (playerTotal === 21) {
		return EOutcome.PlayerBlackjack;
	} else if (dealerTotal === 21) {
		return EOutcome.DealerBlackjack;
	} else {
		return undefined;
	}
}

export function evaluateOutcome(playerTotal: number, dealerTotal: number): EOutcome {
	if (dealerTotal > 21) {
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
			return { bet, total };
	}
}

export function createCard(cardResponse: ICardData): ICard {
	const { image, value, suit, code }: ICardData = cardResponse;
	const point = getCardPoint(value);
	const newCard = { image, value, point, suit, code };
	return newCard;
}

export function getCardPoint(value: CardValue): number {
	if (value === "ACE") {
		return 11;
	} else if (value === "KING" || value === "QUEEN" || value === "JACK") {
		return 10;
	} else {
		return Number(value);
	}
}