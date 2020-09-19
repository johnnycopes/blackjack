import type { IDrawData } from "../models/api/draw-data.interface";
import type { IDeckData } from "../models/api/deck-data.interface";
import type { ICardData } from "../models/api/card-data.interface";
import type { IDeck } from "../models/interfaces/deck.interface";
import type { IHand } from "../models/interfaces/hand.interface";
import type { ICard } from "../models/interfaces/card.interface";
import type { FaceCard } from "../models/types/face-card.type";
import { EOutcome } from "../models/enums/outcome.enum";

interface IDealtCards {
	player: ICard[];
	dealer: ICard[];
}

const apiUrl = "https://deckofcardsapi.com/api/deck";

export function createHand(hidden: boolean): IHand {
	return {
		cards: [],
		total: 0,
		hidden,
		soft: false,
	};
}

export async function fetchDeck(): Promise<IDeck> {
	const response = await fetch(`${apiUrl}/new/shuffle/?deck_count=6`);
	// const response = await fetch(`${apiUrl}/new/?cards=AS,8S,AD,8D,AC,7C,6C,5C,4C,4D,3H`);
	const data: IDeckData = await response.json();
	return {
		id: data.deck_id,
		remaining: data.remaining,
	};
}

export async function dealCardsFromDeck(deckId: string | undefined) {
	if (deckId === undefined) {
		throw new Error("deckId is undefined");
	}
	const response = await fetch(`${apiUrl}/${deckId}/draw/?count=4`);
	const data: IDrawData = await response.json();
	const newCards: IDealtCards = data.cards.reduce((accum, cardResponse, index) => {
		const newCard = createCard(cardResponse);
		if ((index + 1) % 2 === 0) {
			accum.dealer.push(newCard);
		} else {
			accum.player.push(newCard);
		}
		return accum;
	}, { player: [] as ICard[], dealer: [] as ICard[] });
	return newCards;
}

export async function drawCardFromDeck(deckId: string | undefined): Promise<ICard> {
	if (deckId === undefined) {
		throw new Error("deckId is undefined");
	}
	const response = await fetch(`${apiUrl}/${deckId}/draw/?count=1`);
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
		return EOutcome.Blackjack;
	} else if (dealerTotal === 21) {
		return EOutcome.DealerWins;
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

function createCard(cardResponse: ICardData): ICard {
	const { image, value, suit, code }: ICardData = cardResponse;
	const point = getCardPoint(value);
	const newCard = { image, value, point, suit, code };
	return newCard;
}

function getCardPoint(value: FaceCard | string): number {
	if (value === "ACE") {
		return 11;
	} else if (value === "KING" || value === "QUEEN" || value === "JACK") {
		return 10;
	} else {
		return Number(value);
	}
}