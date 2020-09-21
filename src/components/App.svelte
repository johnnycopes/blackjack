<script lang="ts">
	import { onMount } from "svelte";
	import Hand from "./Hand.svelte";
	import Money from "./Money.svelte";
	import Controls from "./Controls.svelte";
	import Outcome from "./Outcome.svelte";
	import type { IDeck } from "../models/interfaces/deck.interface";
	import type { IHand } from "../models/interfaces/hand.interface";
	import type { IMoney } from "../models/interfaces/money.interface";
	import { EOutcome } from "../models/enums/outcome.enum";
	import { wait } from "../utility/wait";
	import {
		createHand,
		fetchDeck,
		dealCardsFromDeck,
		drawCardFromDeck,
		addCardsToHand,
		checkForBlackjacks,
		evaluateOutcome,
		updateMoney
	} from "../utility/gameplay";
	import { fetchOrderedDeck } from "../utility/debugging";
	import type { IOrderedDeckConfig } from "../utility/debugging";

	let playing: boolean;
	let outcome: EOutcome | undefined;
	let deck: IDeck | undefined;
	let playerHand: IHand = createHand(false);
	let dealerHand: IHand = createHand(true);
	let money: IMoney = {
		bet: 0,
		total: 100,
	};

	// Game starts
	$: {
		if (playerHand.cards.length === 2 && dealerHand.cards.length === 2 && !outcome) {
			outcome = checkForBlackjacks(playerHand.total, dealerHand.total);
			if (outcome === EOutcome.Push || outcome === EOutcome.DealerBlackjack) {
				revealDealerHand();
			}
		}
	};

	// Player hits
	$: {
		if (playerHand.total > 21) {
			outcome = EOutcome.PlayerBusts;
			revealDealerHand();
		}
	}

	// Game ends
	$: {
		if (playing && outcome) {
			playing = false;
			money = updateMoney(money, outcome);
			if (!money.total) {
				// TODO: Can I do this without a setTimeout?
				setTimeout(() => {
					alert("You're out of money :(\nRefresh the page to play again.");
				});
			}
		}
	}

	onMount(async () => {
		// const config: IOrderedDeckConfig = {
		// 	player: ["9S", "JS"],
		// 	dealer: ["0C", "JC"],
		// 	others: ["3H", "4H", "5H", "6H"],
		// };
		// deck = await fetchOrderedDeck(config);
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
		// TODO: address bug where player can still hit/stay after clicking stay
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
	<Outcome {outcome} />
	<div class="table">
		<Hand {...dealerHand} />
		<Hand {...playerHand} />
	</div>
	<div class="actions">
		{#if deck}
			<!-- TODO: is there a way to type the event dispatcher? -->
			<Money
				bet={money.bet}
				total={money.total}
				disabled={playing}
				on:betChange={(e) => 
					money = { ...e.detail }
				}
			/>
			{#if money.bet > 0}
				<Controls
					playing={playing}
					on:deal={deal}
					on:hit={hit}
					on:stay={stay}
				/>
			{/if}
		{/if}
	</div>
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

	.table {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
	}

	.actions {
		display: flex;
		height: 64px;
		justify-content: space-between;
		align-items: center;
	}
</style>