<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Chips from "./Chips.svelte";
	import { EProgress } from "../models/enums/progress.enum";
	import { EOutcome } from "../models/enums/outcome.enum";
	import { wait } from "../functions/utility";

	export let progress: EProgress;
	export let outcome: EOutcome;
	const dispatcher = createEventDispatcher<{ betPlaced: boolean }>();
	let bet: number = 0;
	let total: number = 100;
	let prevTotal: number;
	let totalDiff: number;
	let hasUpdatedTotal: boolean;
	$: canChangeBet =
		progress === EProgress.NewGame ||
		progress === EProgress.BlackjackDealt ||
		progress === EProgress.GameOver;
	$: displayMonetaryOutcome = canChangeBet && totalDiff && outcome !== EOutcome.Push;

	// Emit whether or not valid bet has been placed
	$: {
		dispatcher("betPlaced", bet > 0);
	}

	// Track the difference of 'total' between previous and current game
	$: {
		if (prevTotal) {
			totalDiff = total - prevTotal;
		}
		prevTotal = total;
	}

	// Update money on game outcome
	$: {
		if (outcome && !hasUpdatedTotal) {
			if (outcome === EOutcome.PlayerBlackjack) {
				total = total + (bet * 1.5);
			} else if (
				outcome === EOutcome.PlayerWins ||
				outcome === EOutcome.DealerBusts
			) {
				total = total + bet;
			} else if (
				outcome === EOutcome.PlayerBusts ||
				outcome === EOutcome.DealerBlackjack ||
				outcome === EOutcome.DealerWins
			) {
				total = total - bet;
			}
			bet = 0;
			hasUpdatedTotal = true;
		} else if (!outcome) {
			hasUpdatedTotal = false;
		}
	}

	// Show bankruptcy modal if player runs out of money
	$: {
		if (!total) {
			(async () => {
				await wait(1000);
				alert("You're out of money :(\nRefresh the page to play again.");
			})();
		}
	}
</script>

<div class="money">
	<Chips
		{bet}
		{total}
		disabled={!canChangeBet}
		on:betChange={(e) => bet = e.detail}
	/>
	{#if displayMonetaryOutcome}
		<p class="change"
			data-testid="change"
			class:gain={totalDiff > 0}
			class:loss={totalDiff < 0}
		>
			{totalDiff > 0 ? "+" : "-"}${Math.abs(totalDiff)}
		</p>
	{/if}
</div>

<style>
	.money {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		position: absolute;
		height: 100%;
		left: 32px;
		bottom: 0;
	}

	.change {
		margin-left: 8px;
	}

	.gain {
		color: limegreen;
	}

	.loss {
		color: orangered;
	}
</style>