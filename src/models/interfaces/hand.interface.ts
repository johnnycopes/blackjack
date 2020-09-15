import type { ICard } from "./card.interface";

export interface IHand {
	cards: ICard[];
	soft: boolean;
}