import type { ICardData } from "./card-data.interface";

export interface IDrawData {
	success: boolean;
	deck_id: string;
	cards: ICardData[];
	remaining: number;
}