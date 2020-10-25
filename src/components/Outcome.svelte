<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { fade } from "svelte/transition";
	import { cubicIn } from "svelte/easing";
	import { EOutcome } from "../models/enums/outcome.enum";

	export let outcome: EOutcome;
	const dispatcher = createEventDispatcher<{ acceptOutcome: void; }>();
	$: message = getMessage(outcome);
	
	// TODO: display monetary change along with the outcome message
	function getMessage(outcome: EOutcome): string {
		switch (outcome) {
			case EOutcome.PlayerBlackjack:
				return "Blackjack!";
			case EOutcome.PlayerWins:
			case EOutcome.DealerBusts:
				return "Player wins";
			case EOutcome.PlayerBusts:
			case EOutcome.DealerBlackjack:
			case EOutcome.DealerWins:
				return "Dealer wins";
			case EOutcome.Push:
				return "Push";
			default:
				return "";
		}
	}
</script>

{#if outcome}
	<div class="modal"
		in:fade={{ duration: 350, easing: cubicIn }}
		on:click={() => dispatcher("acceptOutcome")}
	>
		<h1 class="message"
			data-testid="outcome"
		>
			{message}
		</h1>
	</div>
{/if}

<style>
	.modal {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 2;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.message {
		font-size: 64px;
		transform: translateY(-50%);
	}
</style>