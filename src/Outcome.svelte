<script lang="ts">
	import { EOutcome } from "./models/enums/outcome.enum";

	export let outcome: EOutcome;
	$: message = getOutcomeMessage(outcome);

	function getOutcomeMessage(outcome: EOutcome): string {
		switch (outcome) {
			case (EOutcome.Blackjack):
				return "Blackjack!";
			case (EOutcome.PlayerWins):
			case (EOutcome.DealerBusts):
				return "Player wins";
			case (EOutcome.PlayerBusts):
			case (EOutcome.DealerWins):
				return "Dealer wins";
			case (EOutcome.Push):
				return "Push";
			default:
				return "";
		}
	}
</script>

<h2 class="message">
	{message}
</h2>

<style>
	.message {
		margin-top: 16px;
	}
</style>