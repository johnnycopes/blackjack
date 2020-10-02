<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Hand from "./Hand.svelte";
	import Money from "./Money.svelte";
	import Controls from "./Controls.svelte";
	import Outcome from "./Outcome.svelte";
	import type { IHand } from "../models/interfaces/hand.interface";
	import type { IMoney } from "../models/interfaces/money.interface";
	import { EStage } from "../models/enums/stage.enum";
	import { EOutcome } from "../models/enums/outcome.enum";
	import {
		createHand,
		checkForBlackjacks,
		evaluateOutcome,
		updateMoney
	} from "../functions/gameplay";

	const clickDispatch = createEventDispatcher();
	export let playerHand: IHand = createHand(false);
	export let dealerHand: IHand = createHand(true);
	export let stage: EStage;
	let playing: boolean;
	let outcome: EOutcome | undefined;
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

	// Player stays
	$: {
		if (stage === EStage.Finished && dealerHand.total > 17) {
			outcome = evaluateOutcome(playerHand.total, dealerHand.total);
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

	function deal(): void {
		playing = true;
		outcome = undefined;
		clickDispatch("deal");
	}

	function hit(): void {
		clickDispatch("hit");
	}

	async function stay(): Promise<void> {
		revealDealerHand();
		clickDispatch("stay");
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
		<Money
			bet={money.bet}
			total={money.total}
			playing={playing}
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
	</div>
</main>

<style>
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