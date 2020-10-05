<script lang="ts">
	import { createEventDispatcher } from "svelte";
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
	$: displayMonetaryOutcome =
		canChangeBet && totalDiff && outcome !== EOutcome.Push;
	$: minBetReached = bet - 10 < 0;
	$: maxBetReached = bet + 10 > total;

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
	<button
		disabled={!canChangeBet || minBetReached}
		on:click={() => bet = bet - 10}
	>
		-
	</button>
	<button
		disabled={!canChangeBet || maxBetReached}
		on:click={() => bet = bet + 10}
	>
		+
	</button>
	<div class="values">
		<p>${bet} (current bet)</p>
		<p>${total} (total money)</p>
	</div>
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
		align-items: center;
	}

	.money > * {
		margin-right: 4px;
	}

	.change {
		font-weight: 700;
	}

	.gain {
		color: limegreen;
	}

	.loss {
		color: salmon;
	}
</style>