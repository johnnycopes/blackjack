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
	let progress: EProgress = EProgress.Betting;
	let deck: IDeck | undefined;
	let playerHand: IHand = createHand();
	let dealerHand: IHand = createHand();

	onMount(async () => {
		deck = await fetchDeck();
	});

	function reset(): void {
		progress = EProgress.Betting;
		playerHand = createHand();
		dealerHand = createHand();
	}

	async function deal(): Promise<void> {
		progress = EProgress.NewGame;
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
		on:acceptOutcome={reset}
		on:deal={deal}
		on:hit={hit}
		on:stand={stand}
	/>
</main>

<style>
	.app {
		display: flex;
		flex-direction: column;
		position: relative;
		min-height: 100%;
	}
</style>