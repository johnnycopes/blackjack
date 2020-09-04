<script lang="ts">
	import type { IDeck } from "./models/interfaces/deck.interface";
	import type { IDeckResponse } from "./models/api/deck-reponse.interface";
	import type { IDrawResponse } from "./models/api/draw-response.interface";

	let deck: IDeck | undefined;

	fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6")
		.then(response => response.json())
		.then((result: IDeckResponse) => {
			deck = {
				id: result.deck_id,
				remaining: result.remaining,
			};
		});
	
	function dealHand(): void {
		if (!deck) {
			return;
		}
		fetch(`https://deckofcardsapi.com/api/deck/${deck.id}/draw/?count=2`)
			.then(response => response.json())
			.then((result: IDrawResponse) => console.log(result));
	}
</script>

<main class="app">
	<h1>Blackjack</h1>
	{#if deck}
		<button on:click={dealHand}>
			Start
		</button>
	{/if}
</main>

<style>
	:global(body) {
		min-height: 100%;
	}

	:global(html, body, h1, h2, h3, h4, h5, h6, ul, ol, li, p) {
		margin: 0;
		padding: 0;
	}

	.app {
		max-width: 1200px;
		width: 90%;
		margin: 0 auto;
		padding-top: 24px;
	}
</style>