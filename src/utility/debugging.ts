import type { IDeckData } from "../models/api/deck-data.interface";
import type { IDeck } from "../models/interfaces/deck.interface";
import type { CardCode } from "../models/types/card-code.type";
import { API_URL } from "../models/constants";

export interface IOrderedDeckConfig {
	player: CardCode[];
	dealer: CardCode[];
	others: CardCode[];
};

export async function fetchOrderedDeck(config: IOrderedDeckConfig): Promise<IDeck> {
	/*
		There's no way to request the API to retrieve an unshuffled deck in a particular order.
		The order of cards (regardless of which specific cards are included) will always go
		spades, diamonds, clubs, hearts. Also, when requesting specific cards from a deck, the 
		deck count is always 1 and can't be changed.
	*/
	const { player, dealer, others } = config;
	const cardCodes = [player[0], dealer[0], player[1], dealer[1], ...others].join(",");
	const response = await fetch(`${API_URL}/new/?cards=${cardCodes}`);
	const data: IDeckData = await response.json();
	return {
		id: data.deck_id,
		remaining: data.remaining,
	};
}