<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Chip from "./Chip.svelte";
	import type { ChipValue } from "../models/types/chip-value.type";
	import { evaluateChipsToShow } from "../functions/gameplay";

	export let bet: number;
	export let total: number;
	export let disabled: boolean;
	const dispatcher = createEventDispatcher<{
		betChange: number;
		betPlaced: boolean
	}>();
	let betChips: ChipValue[] = [];
	$: walletChips = evaluateChipsToShow(total - bet);

	// Calculate total amount of bet chips and emit it whenever chips are added/removed
	$: {
		const betTotal = betChips.reduce((accum, current) => accum + current, 0);
		dispatcher("betChange", betTotal)
	}
</script>

<div class="chips bet">
	{#each betChips as chip}
	<Chip
		value={chip}
		{disabled}
		on:clicked={() =>
			betChips = [...betChips.slice(0, betChips.length - 1)]
		}
		/>
	{/each}
</div>

<div class="chips wallet">
	{#each walletChips as chip}
	<Chip
		value={chip}
		{disabled}
		on:clicked={() => betChips = [...betChips, chip]}
	/>
	{/each}
</div>

<style>
	.chips {
		height: 128px;
		height: 128px;
		margin-bottom: 16px;
	}

	.chips :global(.button) {
		width: 64px;
	}

	.bet {
		width: 128px;
		position: relative;
	}

	.bet :global(.button) {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.bet :global(.button):nth-child(1n) {
		transform: translate(-48%, -51%);
	}

	.bet :global(.button):nth-child(2n) {
		transform: translate(-50%, -52%);
	}

	.bet :global(.button):nth-child(3n) {
		transform: translate(-51%, -48%);
	}

	.bet :global(.button):nth-child(3n) {
		transform: translate(-51%, -48%);
	}

	.wallet {
		display: flex;
		align-items: center;
	}

	.wallet :global(.button) {
		margin-right: 32px;
	}
</style>