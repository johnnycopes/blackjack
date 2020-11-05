import type { CardValue } from "../models/types/card-value";
import type { ChipValue } from "../models/types/chip-value.type";
import type { Suit } from "../models/types/suit.type";
import { preloadImage } from "./utility";

export async function preloadAssets(): Promise<void> {
	const cardValues: CardValue[] = ["ACE", "KING", "QUEEN", "JACK", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
	const cardSuits: Suit[] = ["SPADES", "DIAMONDS", "CLUBS", "HEARTS"];
	const gameChips: ChipValue[] = [1, 5, 10, 25, 50, 100];
	const imageSrcs: string[] = ["./assets/cards/backdesign_8.png"];
	
	for (const value of cardValues) {
		for (const suit of cardSuits) {
			const src = `./assets/cards/${value.toLowerCase()}_${suit.toLowerCase()}.png`;
			imageSrcs.push(src);
		}
	}

	for (const chipValue of gameChips) {
		const src = `./assets/chips/chip_${chipValue}.png`;
		imageSrcs.push(src);
	}

	await Promise.all(imageSrcs.map(src => preloadImage(src)));
}
