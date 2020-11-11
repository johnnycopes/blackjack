import type { IDrawData } from "../models/api/draw-data.interface";
import type { IDeckData } from "../models/api/deck-data.interface";
import type { IDeck } from "../models/interfaces/deck.interface";
import type { IHand } from "../models/interfaces/hand.interface";
import type { ICard } from "../models/interfaces/card.interface";
import type { Suit } from "../models/types/suit.type";
import type { CardValue } from "../models/types/card-value";
import type { ChipValue } from "../models/types/chip-value.type";
import { EOutcome } from "../models/enums/outcome.enum";
import { API_URL } from "../models/constants";
import { appConfig } from "../config/app-config";
import { createCard } from "./card";
import { wait } from "./utility";

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

export function createDeck(data: IDeckData): IDeck {
	return {
		id: data.deck_id,
		remaining: data.remaining,
	};
}

export async function fetchDeck(): Promise<IDeck> {
	const response = await fetch(`${API_URL}/new/shuffle/?deck_count=6`);
	const data: IDeckData = await response.json();
	return createDeck(data);
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

export function addCardsToHand(hand: IHand, ...newCards: ICard[]): IHand {
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

export function evaluateChipsToShow(money: number): ChipValue[] {
	const chipValues: ChipValue[] = [1, 5, 10, 25, 50, 100];
	return chipValues.filter(chipValue => money >= chipValue);
}

export async function preloadImages(): Promise<Map<string, string>> {
	const { imageStrategy } = appConfig;
	const cardValues: CardValue[] = ["ACE", "KING", "QUEEN", "JACK", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
	const cardSuits: Suit[] = ["SPADES", "DIAMONDS", "CLUBS", "HEARTS"];
	const gameChips: ChipValue[] = [1, 5, 10, 25, 50, 100];
	const imageSrcs: { name: string; src: string }[] = [
		{ name: "BACKGROUND", src: "./assets/noise-overlay.png" },
		{ name: "CARD_BACK", src: "./assets/cards/backdesign_8.png" },
	];

	for (const value of cardValues) {
		for (const suit of cardSuits) {
			const name = `${value}_${suit}`;
			const src = `./assets/cards/${value.toLowerCase()}_${suit.toLowerCase()}.png`;
			imageSrcs.push({ name, src });
		}
	}

	for (const chipValue of gameChips) {
		const name = `CHIP_${chipValue}`;
		const src = `./assets/chips/chip_${chipValue}.png`;
		imageSrcs.push({ name, src });
	}

	return imageStrategy(imageSrcs);
}

export async function pause(ms: number): Promise<void> {
	if (!appConfig.waitForAnimations) {
		return;
	} else {
		await wait(ms);
	}
}