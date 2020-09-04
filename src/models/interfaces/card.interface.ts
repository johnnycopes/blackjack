import type { FaceCardValue } from "../types/face-card-value.type";
import type { Suit } from "../types/suit.type";

export interface ICard {
	image: string;
	value: FaceCardValue | number;
	suit: Suit;
	code: string;
}