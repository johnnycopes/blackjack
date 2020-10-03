<script lang="ts">
	import { onMount } from "svelte";
	import Table from "./Table.svelte";
	import { EProgress } from "../models/enums/progress.enum";
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
	let progress: EProgress = EProgress.NewGame;

	onMount(async () => {
		deck = await fetchDeck();
	});

	async function deal(): Promise<void> {
		progress = EProgress.NewGame;
		playerHand = createHand(false);
		dealerHand = createHand(true);
		const dealtCards = await dealCardsFromDeck(deck?.id);
		dealerHand = addCardsToHand(dealerHand, dealtCards.dealer);
		playerHand = addCardsToHand(playerHand, dealtCards.player);
		if (playerHand.total === 21 || dealerHand.total === 21) {
			progress = EProgress.BlackjackDealt;
		} else {
			progress = EProgress.PlayerTurn;
		}
	}

	async function hit(): Promise<void> {
		const newCard = await drawCardFromDeck(deck?.id);
		playerHand = addCardsToHand(playerHand, [newCard]);
		if (playerHand.total > 21) {
			progress = EProgress.GameOver;
		}
	}

	async function stand(): Promise<void> {
		progress = EProgress.DealerTurn;
		await wait(1000);
		while (dealerHand.total < 17) {
			const newCard = await drawCardFromDeck(deck?.id);
			dealerHand = addCardsToHand(dealerHand, [newCard]);
			await wait(1000);
		}
		progress = EProgress.GameOver;
	}
</script>

<main class="app">
	<Table
		playerHand={playerHand}
		dealerHand={dealerHand}
		progress={progress}
		on:deal={deal}
		on:hit={hit}
		on:stand={stand}
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