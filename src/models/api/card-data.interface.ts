import type { Suit } from "../types/suit.type";
import type { CardCode } from "../types/card-code.type";
import type { FaceCard } from "../types/face-card.type";

export interface ICardData {
	code: CardCode;
	suit: Suit;
	value: FaceCard | string;
	image: string;
	images: {
		svg: string;
		png: string;
	};
}