import type { IDeckData } from "../models/api/deck-data.interface";
import type { IDeck } from "../models/interfaces/deck.interface";
import type { CardCode } from "../models/types/card-code.type";
import { API_URL } from "../models/constants";
import type { ICardData } from "../models/api/card-data.interface";
import type { Suit } from "../models/types/suit.type";
import type { CardValue } from "../models/types/card-value";

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

export function createCardData(cardCode: CardCode): ICardData {
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

function getSuit(cardCode: CardCode): Suit {
	const suitLetter = cardCode[1];
	if (suitLetter === "S") {
		return "SPADES";
	} else if (suitLetter === "D") {
		return "DIAMONDS";
	} else if (suitLetter === "C") {
		return "CLUBS";
	} else if (suitLetter === "H") {
		return "HEARTS";
	}
	throw new Error("Invalid card code");
}

function getValue(cardCode: CardCode): CardValue {
	const value = cardCode[0];
	if (value === "A") {
		return "ACE";
	} else if (value === "K") {
		return "KING";
	} else if (value === "Q") {
		return "QUEEN";
	} else if (value === "J") {
		return "JACK";
	} else {
		return value.toString() as CardValue;
	}
}