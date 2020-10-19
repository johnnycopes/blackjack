<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Chip from "./Chip.svelte";
	import type { ChipValue } from "../models/types/chip-value.type";

	export let bet: number;
	export let total: number;
	export let disabled: boolean;
	let betChips: { [T in ChipValue]: boolean };
	$: {
		betChips = calculateBetChips();
	}
	$: minBetReached = bet - 10 < 0;
	$: maxBetReached = bet + 10 > total;
	const chipValues: ChipValue[] = [1, 5, 10, 25, 50, 100];
	const dispatcher = createEventDispatcher<{
		betPlaced: boolean
	}>();

	function calculateBetChips(): { [T in ChipValue]: boolean } {
		return {
			1: true,
			5: true,
			10: true,
			25: true,
			50: true,
			100: true
		};
	}

</script>

<div class="betting-box">
	{#each chipValues as chipValue}
		{#if betChips[chipValue]}
		<Chip
			value={chipValue}
			disabled={disabled || maxBetReached}
			on:clicked={() => console.log(chipValue)}
		/>
		{/if}
	{/each}
</div>

<!-- <div class="wallet">
	{#each chipValues as chipValue}
	<Chip
		value={chipValue}
		disabled={disabled || maxBetReached}
		on:clicked={() => console.log(chipValue)}
	/>
	{/each}
</div> -->

<style>

</style>