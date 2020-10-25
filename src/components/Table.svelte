<script lang="ts">
	import Hand from "./Hand.svelte";
	import Money from "./Money.svelte";
	import Controls from "./Controls.svelte";
	import Outcome from "./Outcome.svelte";
	import type { IHand } from "../models/interfaces/hand.interface";
	import type { EOutcome } from "../models/enums/outcome.enum";
	import { EProgress } from "../models/enums/progress.enum";
	import { evaluateOutcome, evaluateBlackjack } from "../functions/gameplay";

	export let playerHand: IHand;
	export let dealerHand: IHand;
	export let progress: EProgress;
	let outcome: EOutcome | undefined;
	let hasPlacedBet: boolean;
	$: dealerHandHidden = progress === EProgress.NewGame || progress === EProgress.PlayerTurn;

	// Clear outcome variable on new games
	$: {
		if (progress === EProgress.Betting && outcome) {
			outcome = undefined;
		}
	}

	// Cards are dealt
	$: {
		if (progress === EProgress.BlackjackDealt && !outcome) {
			outcome = evaluateBlackjack(playerHand.total, dealerHand.total);
		}
	}

	// Game ends
	$: {
		if (progress === EProgress.GameOver && !outcome) {
			outcome = evaluateOutcome(playerHand.total, dealerHand.total);
		}
	}
</script>

{#if progress === EProgress.Betting}
	<h1 class="prompt">
		Place your bets
	</h1>
{/if}
<Outcome
	{outcome}
	on:acceptOutcome
/>
<div class="table">
	<Hand
		{...dealerHand}
		hasHoleCard={dealerHandHidden}
	/>
	<Hand
		{...playerHand}
		hasHoleCard={false}
	/>
</div>
<div class="actions">
	<Money
		{progress}
		{outcome}
		on:betPlaced={(e) => hasPlacedBet = e.detail}
	/>
	{#if hasPlacedBet}
		<Controls
			{progress}
			on:deal
			on:hit
			on:stand
		/>
	{/if}
</div>

<style>
	.prompt {
		position: absolute;
		top: 128px;
		left: 0;
		width: 100%;
		position: absolute;
		text-align: center;
		font-size: 64px;
	}

	.table {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		height: 64px;
	}
</style>