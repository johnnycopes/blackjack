<script lang="ts">
	import { fade, slide, fly } from 'svelte/transition';
	import { createEventDispatcher } from "svelte";
	import Chip from "./Chip.svelte";
	import type { ChipValue } from "../models/types/chip-value.type";
	import { evaluateChipsToShow } from "../functions/gameplay";

	export let bet: number;
	export let total: number;
	export let disabled: boolean;
	const dispatcher = createEventDispatcher<{
		betChange: number;
	}>();
	let betChips: ChipValue[] = [];
	$: walletChips = evaluateChipsToShow(total - bet);

	// Calculate total amount of bet chips and emit it whenever chips are added/removed
	$: {
		const betTotal = betChips.reduce((accum, current) => accum + current, 0);
		dispatcher("betChange", betTotal)
	}
</script>

<div class="bet">
	{#if bet > 0}
		<h4 class="amount">
			${bet}
		</h4>
	{/if}
	<div class="bet__chips">
		{#each betChips as chip}
		<div class="bet__chip"
			transition:fly="{{ opacity: 1, y: 200, duration: 300 }}"
		>
			<Chip
				value={chip}
				{disabled}
				on:clicked={() =>
					betChips = [...betChips.slice(0, betChips.length - 1)]
				}
				/>
		</div>
		{/each}
	</div>
</div>

<div class="wallet">
	<div class="wallet__chips">
		{#each walletChips as chip}
		<Chip
			value={chip}
			{disabled}
			on:clicked={() => betChips = [...betChips, chip]}
		/>
		{/each}
	</div>
	<h4 class="amount">
		${total - bet}
	</h4>
</div>

<style>
	.bet,
	.wallet {
		width: 128px;
	}

	.bet :global(.button),
	.wallet :global(.button) {
		width: 64px;
	}

	.amount {
		font-size: 36px;
	}

	.bet {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.bet__chips {
		position: relative;
		width: 128px;
		height: 128px;
		margin-top: 16px;
	}

	.bet__chip {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.bet__chip:nth-child(1n) {
		transform: translate(-48%, -51%);
	}

	.bet__chip:nth-child(2n) {
		transform: translate(-50%, -52%);
	}

	.bet__chip:nth-child(3n) {
		transform: translate(-51%, -48%);
	}

	.bet__chip:nth-child(4n) {
		transform: translate(-52%, -49%);
	}

	.wallet {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	}

	.wallet__chips {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 48px;
		min-height: 504px;
	}

	.wallet :global(.button) {
		margin-bottom: 24px;
	}

	.wallet :global(.button):last-child {
		margin: 0;
	}
</style>