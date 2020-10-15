import type { ICardData } from "../models/api/card-data.interface";
import type { ICard } from "../models/interfaces/card.interface";
import type { CardCode } from "../models/types/card-code.type";
import type { CardValue } from "../models/types/card-value";
import type { Suit } from "../models/types/suit.type";

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
	const { value, suit, code }: ICardData = cardResponse;
	const point = getPoint(value);
	const newCard = { value, point, suit, code };
	return newCard;
}
