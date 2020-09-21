<script lang="ts">
	import type { IDeck } from "./models/interfaces/deck.interface";
	import type { IHand } from "./models/interfaces/hand.interface";
	import type { IMoney } from "./models/interfaces/money.interface";
	import { EOutcome } from "./models/enums/outcome.enum";
	import Hand from "./Hand.svelte";
	import Money from "./Money.svelte";
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
		updateMoney
	} from "./utility/gameplay";

	let playing: boolean;
	let outcome: EOutcome | undefined;
	let deck: IDeck | undefined;
	let playerHand: IHand = createHand(false);
	let dealerHand: IHand = createHand(true);
	let money: IMoney = {
		bet: 0,
		total: 100, 
	};

	// Current game starts
	$: {
		if (playerHand.cards.length === 2) {
			outcome = checkForBlackjacks(playerHand.total, dealerHand.total);
		}
		if (playerHand.total > 21) {
			outcome = EOutcome.PlayerBusts;
			revealDealerHand();
		}
	};

	// Current game ends
	$: {
		if (playing && outcome) {
			playing = false;
			money = updateMoney(money, outcome);
			// TOOD: add modal saying playe is out of money
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
		revealDealerHand();
		await wait(1000);
		while (dealerHand.total <= 17) {
			const newCard = await drawCardFromDeck(deck?.id);
			dealerHand = addCardsToHand(dealerHand, [newCard]);
			await wait(1000);
		}
		outcome = evaluateOutcome(playerHand.total, dealerHand.total);
	}

	function resetState(): void {
		outcome = undefined;
		playerHand = createHand(false);
		dealerHand = createHand(true);
		playing = true;
	}

	function revealDealerHand(): void {
		dealerHand.hidden = false;
	}
</script>

<main class="app">
	{#if deck}
		<Money
			bet={money.bet}
			total={money.total}
			disabled={playing}
			on:betChange={e => 
				money = { ...e.detail }
			}
		/>
		<div class="controls">
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
		</div>
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
	.app {
		max-width: 1200px;
		width: 90%;
		margin: 0 auto;
		padding-top: 24px;
	}

	.controls {
		display: flex;
		align-items: center;
		margin-bottom: 8px;
	}

	.controls > * {
		margin-right: 4px;
	}

	.outcome {
		margin-top: 16px;
	}
</style>