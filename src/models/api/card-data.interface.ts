import type { Suit } from "../types/suit.type";
import type { CardCode } from "../types/card-code.type";
import type { CardValue } from "../types/card-value";

export interface ICardData {
	code: CardCode;
	suit: Suit;
	value: CardValue;
	image: string;
	images: {
		svg: string;
		png: string;
	};
}