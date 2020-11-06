<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { fly } from "svelte/transition";
	import { cubicOut } from "svelte/easing";
	import Chip from "./Chip.svelte";
	import type { ChipValue } from "../models/types/chip-value.type";
	import { EProgress } from "../models/enums/progress.enum";
	import { EOutcome } from "../models/enums/outcome.enum";
	import { EDuration } from "../models/enums/duration.enum";
	import { evaluateChipsToShow, pause } from "../functions/gameplay";

	export let progress: EProgress;
	export let outcome: EOutcome;
	const dispatcher = createEventDispatcher<{ betPlaced: boolean }>();
	let bet: number = 0;
	let total: number = 500;
	let betChips: ChipValue[] = [];
	let hasUpdatedTotal = false;
	const defaultChipDeltas: Record<ChipValue, { x: number, y: number }> = {
		1:   { x: -64, y: window.innerHeight - 504 },
		5:   { x:  64, y: window.innerHeight - 504 },
		10:  { x: -64, y: window.innerHeight - 376 },
		25:  { x:  64, y: window.innerHeight - 376 },
		50:  { x: -64, y: window.innerHeight - 248 },
		100: { x:  64, y: window.innerHeight - 248 },
	};
	$: canBet = progress === EProgress.Betting;
	$: walletChips = evaluateChipsToShow(total - bet);

	// Whenever chips are added/removed, calculate new bet value and emit
	$: {
		bet = getAmount(betChips);
		dispatcher("betPlaced", bet > 0);
	}
	
	// Update money on game outcome
	$: {
		if (outcome && !hasUpdatedTotal) {
			let bet = getAmount(betChips);
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
			betChips = [];
			hasUpdatedTotal = true;
		} else if (!outcome) {
			hasUpdatedTotal = false;
		}
	}

	function chipAnimation(chip: ChipValue): any {
		const { x, y } = evaluateChipDelta(chip);
		return {
			opacity: 1,
			x,
			y,
			easing: cubicOut,
			duration: EDuration.Chip
		};
	}

	function evaluateChipDelta(chip: ChipValue): { x: number, y: number } {
		switch (outcome) {
			case EOutcome.PlayerBlackjack:
			case EOutcome.PlayerWins:
			case EOutcome.DealerBusts:
				return { x: 0, y: window.innerHeight };
			case EOutcome.PlayerBusts:
			case EOutcome.DealerBlackjack:
			case EOutcome.DealerWins:
				return { x: 0, y: -256 };
			case EOutcome.Push:
			case undefined:
				return defaultChipDeltas[chip];
		}
	}

	function getAmount(chips: ChipValue[]): number {
		return chips.reduce((accum, current) => accum + current, 0);
	}

	// Show bankruptcy modal if player runs out of money
	$: {
		if (!total) {
			(async () => {
				await pause();
				alert("You're out of money :(\nRefresh the page to play again.");
			})();
		}
	}
</script>

<div class="money">
	<div class="bet">
		<h4 class="amount"
			data-testid="bet"
		>
			{#if bet > 0}
				${bet}
			{/if}
		</h4>
		<div class="bet__chips">
			{#each betChips as chip}
				<div class="bet__chip"
					in:fly={chipAnimation(chip)}
					out:fly={chipAnimation(chip)}
				>
					<Chip
						value={chip}
						disabled={!canBet}
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
					disabled={!canBet}
					on:clicked={() => betChips = [...betChips, chip]}
				/>
			{/each}
		</div>
		<h4 class="amount"
			data-testid="wallet"
		>
			${total - bet}
		</h4>
	</div>
</div>

<style>
	.money {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		position: absolute;
		height: 100%;
		left: 32px;
	}

	.bet :global(.button),
	.wallet :global(.button) {
		width: 64px;
		background: transparent;
		border: 0;
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