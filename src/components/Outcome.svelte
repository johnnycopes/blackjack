<script lang="ts">
	import { EOutcome } from "../models/enums/outcome.enum";

	export let outcome: EOutcome;
	$: message = getMessage(outcome);

	function getMessage(outcome: EOutcome): string {
		switch (outcome) {
			case (EOutcome.PlayerBlackjack):
				return "Blackjack!";
			case (EOutcome.PlayerWins):
			case (EOutcome.DealerBusts):
				return "Player wins";
			case (EOutcome.PlayerBusts):
			case (EOutcome.DealerBlackjack):
			case (EOutcome.DealerWins):
				return "Dealer wins";
			case (EOutcome.Push):
				return "Push";
			default:
				return "";
		}
	}
</script>

<h2 class="message"
	data-testid="outcome"
>
	{message}
</h2>

<style>
	.message {
		height: 64px;
		font-size: 36px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>