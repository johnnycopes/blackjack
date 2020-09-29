import type { IDeckData } from "../models/api/deck-data.interface";
import type { ICardData } from "../models/api/card-data.interface";
import type { IDeck } from "../models/interfaces/deck.interface";
import type { ICard } from "../models/interfaces/card.interface";
import type { CardCode } from "../models/types/card-code.type";
import type { CardValue } from "../models/types/card-value";
import type { Suit } from "../models/types/suit.type";
import { API_URL } from "../models/constants";

export interface IOrderedDeckConfig {
	player: CardCode[];
	dealer: CardCode[];
	others: CardCode[];
};

export async function fetchOrderedDeck(config: IOrderedDeckConfig): Promise<IDeck> {
	/*
		There's no way to request the API to retrieve an unshuffled deck in a particular order.
		The order of cards (regardless of which specific cards are included) will always go
		spades, diamonds, clubs, hearts. Also, when requesting specific cards from a deck, the 
		deck count is always 1 and can't be changed.
	*/
	const { player, dealer, others } = config;
	const cardCodes = [player[0], dealer[0], player[1], dealer[1], ...others].join(",");
	const response = await fetch(`${API_URL}/new/?cards=${cardCodes}`);
	const data: IDeckData = await response.json();
	return {
		id: data.deck_id,
		remaining: data.remaining,
	};
}

export function getSuit(cardCode: CardCode): Suit {
	const suitLetter = cardCode[1];
	switch (suitLetter) {
		case "S":
			return "SPADES";
		case "D":
			return "DIAMONDS";
		case "C":
			return "CLUBS";
		case "H":
			return "HEARTS";
		default:
			throw new Error("Invalid card code (not a valid suit)");
	}
}

export function getValue(cardCode: CardCode): CardValue {
	const valueSymbol = cardCode[0];
	switch (valueSymbol) {
		case "A":
			return "ACE";
		case "K":
			return "KING";
		case "Q":
			return "QUEEN";
		case "J":
			return "JACK";
		case "0":
			return "10";
		case "9": case "8": case "7": case "6": case "5": case "4": case "3": case "2":
			return valueSymbol.toString() as CardValue;
		default:
			throw new Error("Invalid card code (not a valid value)");
	}
}

export function getPoint(value: CardValue): number {
	if (value === "ACE") {
		return 11;
	} else if (value === "KING" || value === "QUEEN" || value === "JACK") {
		return 10;
	} else {
		return Number(value);
	}
}

export function createCard(cardResponse: ICardData): ICard {
	const { image, value, suit, code }: ICardData = cardResponse;
	const point = getPoint(value);
	const newCard = { image, value, point, suit, code };
	return newCard;
}

/*
	In the actual game, the ICardData objects will be returned by the API.
	These functions are used in other tests to generate mock data
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