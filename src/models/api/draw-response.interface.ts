import type { ICardResponse } from "./card-response.interface";

export interface IDrawResponse {
	success: boolean;
	deck_id: string;
	cards: ICardResponse[];
	remaining: number;
}