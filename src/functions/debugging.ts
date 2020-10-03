import type { ICardData } from "../models/api/card-data.interface";
import type { IHand } from "../models/interfaces/hand.interface";
import type { ICard } from "../models/interfaces/card.interface";
import type { CardCode } from "../models/types/card-code.type";
import { createCard, getSuit, getValue } from "./card";
import { addCardsToHand, createHand } from "./gameplay";

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
	const updatedFakeHand = addCardsToHand(fakeHand, fakeCards);
	return updatedFakeHand;
}