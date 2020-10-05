<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { EProgress } from "../models/enums/progress.enum";
	import type { IMoney } from "../models/interfaces/money.interface";

	export let bet: number;
	export let total: number;
	export let progress: EProgress;
	const dispatcher = createEventDispatcher<{ betChange: IMoney }>();
	let prevTotal: number;
	let totalDiff: number;
	$: canChangeBet =
		progress === EProgress.NewGame ||
		progress === EProgress.BlackjackDealt ||
		progress === EProgress.GameOver;

	$: {
		if (prevTotal) {
			totalDiff = total - prevTotal;
		}
		prevTotal = total;
	}

	$: minBetReached = bet - 10 < 0;
	$: maxBetReached = bet + 10 > total;

	function increaseBet(): void {
		dispatcher("betChange", {
			bet: bet + 10,
			total
		});
	}

	function decreaseBet(): void {
		dispatcher("betChange", {
			bet: bet - 10,
			total
		});
	}
</script>

<div class="money">
	<button
		disabled={!canChangeBet || minBetReached}
		on:click={decreaseBet}
	>
		-
	</button>
	<button
		disabled={!canChangeBet || maxBetReached}
		on:click={increaseBet}
	>
		+
	</button>
	<div class="values">
		<p>${bet} (current bet)</p>
		<p>${total} (total money)</p>
	</div>
	{#if canChangeBet && totalDiff}
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