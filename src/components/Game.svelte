<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Hand from "./Hand.svelte";
	import Money from "./Money.svelte";
	import Controls from "./Controls.svelte";
	import Outcome from "./Outcome.svelte";
	import type { IHand } from "../models/interfaces/hand.interface";
	import type { IMoney } from "../models/interfaces/money.interface";
	import { ETurn } from "../models/enums/turn.enum";
	import { EOutcome } from "../models/enums/outcome.enum";
	import {
		createHand,
		checkForBlackjacks,
		evaluateOutcome,
		updateMoney
	} from "../functions/gameplay";

	const clickDispatch = createEventDispatcher();
	export let playerHand: IHand = createHand(false);
	export let dealerHand: IHand = createHand(true);
	export let turn: ETurn;
	let outcome: EOutcome | undefined;
	let money: IMoney = {
		bet: 0,
		total: 100,
	};
	$: playing = turn === ETurn.Player || turn === ETurn.Dealer;

	$: {
		if (turn === ETurn.Finished && !outcome) {
			if (playerHand.cards.length === 2 && dealerHand.cards.length === 2) {
				outcome = checkForBlackjacks(playerHand.total, dealerHand.total);
			} else if (playerHand.total > 21) {
				outcome = EOutcome.PlayerBusts;
			} else {
				outcome = evaluateOutcome(playerHand.total, dealerHand.total);
			}
			
			if (outcome) {
				money = updateMoney(money, outcome);
				if (!money.total) {
					// TODO: Can I do this without a setTimeout?
					setTimeout(() => {
						alert("You're out of money :(\nRefresh the page to play again.");
					});
				}
			}
		}
	}

	// Game starts
	// $: {
	// 	if (playerHand.cards.length === 2 && dealerHand.cards.length === 2 && !outcome) {
	// 		outcome = checkForBlackjacks(playerHand.total, dealerHand.total);
	// 		if (outcome === EOutcome.Push || outcome === EOutcome.DealerBlackjack) {
	// 			revealDealerHand();
	// 		}
	// 	}
	// };

	// Player hits
	// $: {
	// 	if (playerHand.total > 21) {
	// 		outcome = EOutcome.PlayerBusts;
	// 		revealDealerHand();
	// 	}
	// }

	// Player stays
	// $: {
	// 	if (turn === ETurn.Nobody && dealerHand.total > 17) {
	// 		outcome = evaluateOutcome(playerHand.total, dealerHand.total);
	// 	}
	// }

	// Game ends
	// $: {
	// 	if (outcome) {
	// 		money = updateMoney(money, outcome);
	// 		if (!money.total) {
	// 			// TODO: Can I do this without a setTimeout?
	// 			setTimeout(() => {
	// 				alert("You're out of money :(\nRefresh the page to play again.");
	// 			});
	// 		}
	// 	}
	// }

	function deal(): void {
		clickDispatch("deal");
		outcome = undefined;
	}

	function hit(): void {
		clickDispatch("hit");
	}

	async function stay(): Promise<void> {
		revealDealerHand();
		clickDispatch("stay");
	}

	function revealDealerHand(): void {
		dealerHand.hidden = false;
	}
</script>

<Outcome {outcome} />
<div class="table">
	<Hand {...dealerHand} />
	<Hand {...playerHand} />
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
			on:deal={deal}
			on:hit={hit}
			on:stay={stay}
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