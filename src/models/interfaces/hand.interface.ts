import type { ICard } from "./card.interface";

export interface IHand {
	cards: ICard[];
	total: number;
	hidden: boolean;
	soft: boolean;
}