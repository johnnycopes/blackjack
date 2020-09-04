import type { FaceCard } from "../types/face-card.type";
import type { Suit } from "../types/suit.type";
import type { CardCode } from "../types/card-code.type";

export interface ICard {
	image: string;
	value: FaceCard | string;
	point: number;
	suit: Suit;
	code: CardCode;
}
