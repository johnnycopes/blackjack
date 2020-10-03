<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Hand from "./Hand.svelte";
	import Money from "./Money.svelte";
	import Controls from "./Controls.svelte";
	import Outcome from "./Outcome.svelte";
	import type { IHand } from "../models/interfaces/hand.interface";
	import type { IMoney } from "../models/interfaces/money.interface";
	import { EProgress } from "../models/enums/progress.enum";
	import { EOutcome } from "../models/enums/outcome.enum";
	import {
		createHand,
		evaluateOutcome,
		evaluateBlackjack,
		updateMoney,
	} from "../functions/gameplay";
	import { wait } from "../functions/utility";

	const dispatcher = createEventDispatcher<{
		deal: void;
		hit: void;
		stay: void;
	}>();
	export let playerHand: IHand = createHand(false);
	export let dealerHand: IHand = createHand(true);
	export let progress: EProgress;
	let playing: boolean;
	let outcome: EOutcome | undefined;
	let money: IMoney = {
		bet: 0,
		total: 100,
	};

	// Clear outcome variable on new games
	$: {
		if (progress === EProgress.NewGame && !!outcome) {
			outcome = undefined;
		}
	}

	// Enable/disable playing variable as game progresses
	$: playing = progress === EProgress.PlayerTurn || progress === EProgress.DealerTurn;

	// Cards are dealt
	$: {
		if (progress === EProgress.BlackjackDealt && !outcome) {
			outcome = evaluateBlackjack(playerHand.total, dealerHand.total);
			money = updateMoney(money, outcome);
			if (outcome === EOutcome.Push || outcome === EOutcome.DealerBlackjack) {
				revealDealerHand();
			}
		}
	}

	// Game ends
	$: {
		if (progress === EProgress.GameOver && !outcome) {
			outcome = evaluateOutcome(playerHand.total, dealerHand.total);
			money = updateMoney(money, outcome);
		}
	}

	// Show bankruptcy modal
	$: {
		if (!money.total) {
			(async () => {
				await wait(1000);
				alert("You're out of money :(\nRefresh the page to play again.");
			})();
		}
	}

	function deal(): void {
		dispatcher("deal");
	}

	function hit(): void {
		dispatcher("hit");
	}

	function stay(): void {
		revealDealerHand();
		dispatcher("stay");
	}

	// TODO: should this be modified in the parent instead?
	function revealDealerHand(): void {
		dealerHand.hidden = false;
	}
</script>

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