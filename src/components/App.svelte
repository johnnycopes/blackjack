<script lang="ts">
	import { onMount } from "svelte";
	import Game from "./Game.svelte";
	import Loader from "./Loader.svelte";
	import type { IDeck } from "../models/interfaces/deck.interface";
	import type { IHand } from "../models/interfaces/hand.interface";
	import { EProgress } from "../models/enums/progress.enum";
	import { EDuration } from "../models/enums/duration.enum";
	import { appConfig } from "../config/app-config";
	import { images } from "../stores";
	import {
		createHand,
		fetchDeck,
		dealCardsFromDeck,
		drawCardFromDeck,
		addCardsToHand,
		preloadImages,
		pause
	} from "../functions/gameplay";

	let progress: EProgress = EProgress.Betting;
	let deck: IDeck | undefined;
	let playerHand: IHand = createHand();
	let dealerHand: IHand = createHand();
	$: ready = !appConfig.waitForAnimations || !!deck;

	onMount(async () => {
		const [deckResponse, imagesResponse] = await Promise.all([
			fetchDeck(),
			preloadImages()
		]);
		deck = deckResponse;
		images.set(imagesResponse);
	});

	function reset(): void {
		progress = EProgress.Betting;
		playerHand = createHand();
		dealerHand = createHand();
	}

	async function deal(): Promise<void> {
		progress = EProgress.NewGame;
		const { player, dealer } = await dealCardsFromDeck(deck?.id);

		for (let i = 0; i < 2; i++) {
			dealerHand = addCardsToHand(dealerHand, dealer[i]);
			await pause(EDuration.Card);
			playerHand = addCardsToHand(playerHand, player[i]);
			await pause(EDuration.Card);
		}

		if (playerHand.total === 21 || dealerHand.total === 21) {
			await pause(EDuration.Card);
			progress = EProgress.BlackjackDealt;
		} else {
			progress = EProgress.PlayerTurn;
		}
	}

	async function hit(): Promise<void> {
		const newCard = await drawCardFromDeck(deck?.id);
		playerHand = addCardsToHand(playerHand, newCard);
		await pause(EDuration.Card);
		if (playerHand.total > 21) {
			progress = EProgress.GameOver;
		}
	}

	async function stand(): Promise<void> {
		progress = EProgress.DealerTurn;
		await pause(EDuration.Card);
		while (dealerHand.total < 17) {
			const newCard = await drawCardFromDeck(deck?.id);
			dealerHand = addCardsToHand(dealerHand, newCard);
			await pause(EDuration.DealerAction);
		}
		progress = EProgress.GameOver;
	}
</script>

{#if ready}
	<main class="game">
		<Game
			{playerHand}
			{dealerHand}
			{progress}
			on:acceptOutcome={reset}
			on:deal={deal}
			on:hit={hit}
			on:stand={stand}
		/>
	</main>
{:else}
	<div class="loader">
		<Loader />
	</div>
{/if}

<style>
	.game {
		display: flex;
		flex-direction: column;
		position: relative;
		min-height: 100%;
	}

	.loader {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}
</style>