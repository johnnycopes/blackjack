<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { fly } from "svelte/transition";
	import { cubicOut } from "svelte/easing";
	import Chip from "./Chip.svelte";
	import type { ChipValue } from "../models/types/chip-value.type";
	import { evaluateChipsToShow } from "../functions/gameplay";

	export let total: number;
	export let disabled: boolean;
	const dispatcher = createEventDispatcher<{
		betChange: number;
	}>();
	let bet: number = 0;
	let betChips: ChipValue[] = [];
	const chipAnimations: Record<ChipValue, { x: number, y: number }> = {
		1:   { x: -64, y: window.innerHeight - 504 },
		5:   { x:  64, y: window.innerHeight - 504 },
		10:  { x: -64, y: window.innerHeight - 376 },
		25:  { x:  64, y: window.innerHeight - 376 },
		50:  { x: -64, y: window.innerHeight - 248 },
		100: { x:  64, y: window.innerHeight - 248 },
	};
	$: walletChips = evaluateChipsToShow(total - bet);

	// Calculate total amount of bet chips and emit it whenever chips are added/removed
	$: {
		bet = betChips.reduce((accum, current) => accum + current, 0);
		dispatcher("betChange", bet);
	}
</script>

<div class="bet">
	<h4 class="amount">
		{#if bet > 0}
			${bet}
		{/if}
	</h4>
	<div class="bet__chips">
		{#each betChips as chip}
		<div class="bet__chip"
			transition:fly="{{
				opacity: 1,
				x: chipAnimations[chip].x,
				y: chipAnimations[chip].y,
				easing: cubicOut,
				duration: 350
			}}"
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
	.bet :global(.button),
	.wallet :global(.button) {
		width: 64px;
	}

	.amount {
		font-size: 36px;
		min-height: 60px;
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
	}

	.bet__chip {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 1;
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
		display: grid;
		grid-template-columns: repeat(2, 128px);
		grid-template-rows: repeat(3, 128px);
		justify-items: center;
		align-items: center;
	}
</style>