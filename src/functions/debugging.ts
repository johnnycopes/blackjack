import type { IDeckData } from "../models/api/deck-data.interface";
import type { IDrawData } from "../models/api/draw-data.interface";
import type { ICardData } from "../models/api/card-data.interface";
import type { IDeck } from "../models/interfaces/deck.interface";
import type { IHand } from "../models/interfaces/hand.interface";
import type { ICard } from "../models/interfaces/card.interface";
import type { CardCode } from "../models/types/card-code.type";
import { createCard, getSuit, getValue } from "./card";
import { addCardsToHand, createDeck, createHand } from "./gameplay";

/*
	These functions are only used in other tests to generate mock data.
	In the actual game, the ICardData objects will be returned by the API.
*/

export function createFakeCardData(cardCode: CardCode): ICardData {
	return {
		code: cardCode,
		suit: getSuit(cardCode),
		value: getValue(cardCode),
		image: `https://deckofcardsapi.com/static/img/${cardCode}.png`,
		images: {
			svg: `https://deckofcardsapi.com/static/img/${cardCode}.svg`,
			png: `https://deckofcardsapi.com/static/img/${cardCode}.png`,
		}
	};
}

export function createFakeCard(cardCode: CardCode): ICard {
	const fakeCardData = createFakeCardData(cardCode);
	return createCard(fakeCardData);
}

export function createFakeHand(...cardCodes: CardCode[]): IHand {
	const fakeHand = createHand();
	const fakeCards = cardCodes.map(cardCode => createFakeCard(cardCode));
	const updatedFakeHand = addCardsToHand(fakeHand, ...fakeCards);
	return updatedFakeHand;
}

export function createFakeDeckData(): IDeckData {
	return {
		deck_id: "77cikknyaadb",
		remaining: 312,
		shuffled: true,
		success: true,
	};
}

export function createFakeDeck(deckData: IDeckData = createFakeDeckData()): IDeck {
	return createDeck(deckData);
}

export function drawFromFakeDeck(deck: IDeck, cardCodes: CardCode[]): IDrawData {
	deck.remaining = deck.remaining - cardCodes.length;
	return {
		deck_id: deck.id,
		cards: cardCodes.map(cardCode => createFakeCardData(cardCode)),
		remaining: deck.remaining,
		success: true,
	};
}