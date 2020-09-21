<script lang="ts">
	import { createEventDispatcher } from "svelte";

	export let bet: number;
	export let total: number;
	export let disabled: boolean;
	const betDispatch = createEventDispatcher();

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
</div>

<style>
	.money {
		display: flex;
		align-items: center;
		margin-bottom: 8px;
	}

	.money > * {
		margin-right: 4px;
	}
</style>