<script lang="ts">
	import { onMount } from "svelte";
	import Game from "./Game.svelte";
	import { ETurn } from "../models/enums/turn.enum";
	import type { IDeck } from "../models/interfaces/deck.interface";
	import type { IHand } from "../models/interfaces/hand.interface";
	import {
		createHand,
		fetchDeck,
		dealCardsFromDeck,
		drawCardFromDeck,
		addCardsToHand,
	} from "../functions/gameplay";
import { wait } from "../functions/utility";

	let deck: IDeck | undefined;
	let playerHand: IHand = createHand(false);
	let dealerHand: IHand = createHand(true);
	let turn: ETurn = ETurn.New;

	onMount(async () => {
		deck = await fetchDeck();
	});

	async function deal(): Promise<void> {
		turn = ETurn.New;
		console.log(turn);
		playerHand = createHand(false);
		dealerHand = createHand(true);
		const dealtCards = await dealCardsFromDeck(deck?.id);
		dealerHand = addCardsToHand(dealerHand, dealtCards.dealer);
		playerHand = addCardsToHand(playerHand, dealtCards.player);
		if (playerHand.total === 21 || dealerHand.total === 21) {
			turn = ETurn.Finished;
		} else {
			turn = ETurn.Player;
		}
	}

	async function hit(): Promise<void> {
		const newCard = await drawCardFromDeck(deck?.id);
		playerHand = addCardsToHand(playerHand, [newCard]);
		if (playerHand.total > 21) {
			turn = ETurn.Finished;
		}
	}

	async function stay(): Promise<void> {
		turn = ETurn.Dealer;
		await wait(1000);
		while (dealerHand.total <= 17) {
			const newCard = await drawCardFromDeck(deck?.id);
			dealerHand = addCardsToHand(dealerHand, [newCard]);
			await wait(1000);
		}
		turn = ETurn.Finished;
	}
</script>

<main class="app">
	<Game
		playerHand={playerHand}
		dealerHand={dealerHand}
		turn={turn}
		on:deal={deal}
		on:hit={hit}
		on:stay={stay}
	/>
</main>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100%;
		max-width: 1024px;
		width: 90%;
		margin: 0 auto;
		padding: 48px 0;
	}
</style>