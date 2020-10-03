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
	import { wait } from "../functions/utility";

	export let playerHand: IHand;
	export let dealerHand: IHand;
	export let progress: EProgress;
	let playing: boolean;
	let outcome: EOutcome | undefined;
	let dealerHandHidden: boolean;
	let money: IMoney = {
		bet: 0,
		total: 100,
	};

	// Clear outcome variable on new games
	$: {
		if (progress === EProgress.NewGame && !!outcome) {
			outcome = undefined;
		}
	}

	// Reveal the dealer's hole card when it's no longer the player's turn
	$: dealerHandHidden = progress === EProgress.NewGame || progress === EProgress.PlayerTurn;

	// Enable/disable playing variable as game progresses
	$: playing = progress === EProgress.PlayerTurn || progress === EProgress.DealerTurn;

	// Cards are dealt
	$: {
		if (progress === EProgress.BlackjackDealt && !outcome) {
			outcome = evaluateBlackjack(playerHand.total, dealerHand.total);
			money = updateMoney(money, outcome);
		}
	}

	// Game ends
	$: {
		if (progress === EProgress.GameOver && !outcome) {
			outcome = evaluateOutcome(playerHand.total, dealerHand.total);
			money = updateMoney(money, outcome);
		}
	}

	// Show bankruptcy modal
	$: {
		if (!money.total) {
			(async () => {
				await wait(1000);
				alert("You're out of money :(\nRefresh the page to play again.");
			})();
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
		bet={money.bet}
		total={money.total}
		playing={playing}
		on:betChange={(e) => 
			money = { ...e.detail }
		}
	/>
	{#if money.bet > 0}
		<Controls
			playing={playing}
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