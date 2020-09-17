<script lang="typescript">
	import type { IDeck } from "./models/interfaces/deck.interface";
	import type { IHand } from "./models/interfaces/hand.interface";
	import { EOutcome } from "./models/enums/outcome.enum";
	import Hand from "./Hand.svelte";
	import { onMount } from "svelte";
	import { wait } from "./utility/wait";
	import {
		createHand,
		fetchDeck,
		dealCardsFromDeck,
		drawCardFromDeck,
		addCardsToHand,
		checkForBlackjacks,
		evaluateOutcome,
	} from "./utility/gameplay";

	let playing: boolean;
	let outcome: EOutcome | undefined;
	let deck: IDeck | undefined;
	let playerHand: IHand = createHand();
	let dealerHand: IHand = createHand();

	// Current game starts
	$: {
		if (playerHand.cards.length === 2 && dealerHand.cards.length === 2) {
			outcome = checkForBlackjacks(playerHand.total, dealerHand.total);
		}
		if (playerHand.total > 21) {
			outcome = EOutcome.PlayerBusts;
		}
	};

	// Current game ends
	$: {
		if (playing && outcome) {
			playing = false;
		}
	}

	onMount(async () => {
		deck = await fetchDeck();
	});

	async function deal(): Promise<void> {
		resetState();
		const dealtCards = await dealCardsFromDeck(deck?.id);
		dealerHand = addCardsToHand(dealerHand, dealtCards.dealer);
		playerHand = addCardsToHand(playerHand, dealtCards.player);
	}

	async function hit(): Promise<void> {
		const newCard = await drawCardFromDeck(deck?.id);
		playerHand = addCardsToHand(playerHand, [newCard]);
	}

	async function stay(): Promise<void> {
		while (dealerHand.total <= 17) {
			const newCard = await drawCardFromDeck(deck?.id);
			dealerHand = addCardsToHand(dealerHand, [newCard]);
			await wait(700);
		}
		outcome = evaluateOutcome(playerHand.total, dealerHand.total);
	}

	function resetState(): void {
		outcome = undefined;
		playerHand = createHand();
		dealerHand = createHand();
		playing = true;
	}
</script>

<main class="app">
	{#if deck}
		<button
			disabled={playing}
			on:click={deal}
		>
			Deal
		</button>
		<button
			disabled={!playing}
			on:click={hit}
		>
			Hit
		</button>
		<button
			disabled={!playing}
			on:click={stay}
		>
			Stay
		</button>
	{/if}
	<div class="table">
		<Hand {...dealerHand} />
		<Hand {...playerHand} />
		{#if outcome}
			<h2 class="outcome">
				{outcome}
			</h2>
		{/if}
	</div>
</main>

<style>
	:global(body) {
		min-height: 100%;
	}

	:global(html, body, h1, h2, h3, h4, h5, h6, ul, ol, li, p) {
		margin: 0;
		padding: 0;
	}

	.app {
		max-width: 1200px;
		width: 90%;
		margin: 0 auto;
		padding-top: 24px;
	}

	.outcome {
		margin-top: 16px;
	}
</style>