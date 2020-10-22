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
		pause
	} from "../functions/gameplay";

	export let inTestMode: boolean = false;
	let deck: IDeck | undefined;
	let playerHand: IHand = createHand();
	let dealerHand: IHand = createHand();
	let progress: EProgress = EProgress.NewGame;

	onMount(async () => {
		deck = await fetchDeck();
	});

	async function deal(): Promise<void> {
		progress = EProgress.NewGame;
		playerHand = createHand();
		dealerHand = createHand();
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
		await pause(inTestMode);
		while (dealerHand.total < 17) {
			const newCard = await drawCardFromDeck(deck?.id);
			dealerHand = addCardsToHand(dealerHand, [newCard]);
			await pause(inTestMode);
		}
		progress = EProgress.GameOver;
	}
</script>

<main class="app">
	<Table
		{playerHand}
		{dealerHand}
		{progress}
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