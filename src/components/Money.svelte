<script lang="ts">
	import { createEventDispatcher } from "svelte";

	export let bet: number;
	export let total: number;
	export let disabled: boolean;
	const betDispatch = createEventDispatcher();
	let prevTotal: number;
	let totalDiff: number;

	$: {
		if (prevTotal) {
			totalDiff = total - prevTotal;
		}
		prevTotal = total;
	}

	$: minBetReached = bet - 10 < 0;
	$: maxBetReached = bet + 10 > total;

	function increaseBet(): void {
		betDispatch("betChange", {
			bet: bet + 10,
			total
		});
	}

	function decreaseBet(): void {
		betDispatch("betChange", {
			bet: bet - 10,
			total
		});
	}
</script>

<div class="money">
	<button
		disabled={disabled || minBetReached}
		on:click={decreaseBet}
	>
		-
	</button>
	<button
		disabled={disabled || maxBetReached}
		on:click={increaseBet}
	>
		+
	</button>
	<div class="values">
		<p>${bet} (current bet)</p>
		<p>${total} (total money)</p>
	</div>
	{#if !disabled && totalDiff}
		<p class="change"
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