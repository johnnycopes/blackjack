import type { Suit } from "../types/suit.type";
import type { CardValue } from "../types/card-value";
import type { CardCode } from "../types/card-code.type";

export interface ICard {
	value: CardValue;
	point: number;
	suit: Suit;
	code: CardCode;
}
