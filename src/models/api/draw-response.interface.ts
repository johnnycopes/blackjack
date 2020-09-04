import type { ICard } from "../interfaces/card.interface";

export interface IDrawResponse {
	success: boolean;
	deck_id: string;
	cards: ICard[];
	remaining: number;
}