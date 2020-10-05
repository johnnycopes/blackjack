<script lang="ts">
	import Hand from "./Hand.svelte";
	import Money from "./Money.svelte";
	import Controls from "./Controls.svelte";
	import Outcome from "./Outcome.svelte";
	import type { IHand } from "../models/interfaces/hand.interface";
	import type { IMoney } from "../models/interfaces/money.interface";
	import type { EOutcome } from "../models/enums/outcome.enum";
	import { EProgress } from "../models/enums/progress.enum";
	import {
		evaluateOutcome,
		evaluateBlackjack,
		updateMoney,
	} from "../functions/gameplay";

	export let playerHand: IHand;
	export let dealerHand: IHand;
	export let progress: EProgress;
	let outcome: EOutcome | undefined;
	let betPlaced: boolean;
	$: dealerHandHidden = progress === EProgress.NewGame || progress === EProgress.PlayerTurn;

	// Clear outcome variable on new games
	$: {
		if (progress === EProgress.NewGame && !!outcome) {
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

<Outcome {outcome} />
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
		progress={progress}
		outcome={outcome}
		on:betPlaced={(e) => betPlaced = e.detail}
	/>
	{#if betPlaced}
		<Controls
			progress={progress}
			on:deal
			on:hit
			on:stand
		/>
	{/if}
</div>

<style>
	.table {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
	}

	.actions {
		display: flex;
		height: 64px;
		justify-content: space-between;
		align-items: center;
	}
</style>