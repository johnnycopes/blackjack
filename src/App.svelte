<script lang="ts">
	import type { IDeck } from "./models/interfaces/deck.interface";
	import type { ICard } from "./models/interfaces/card.interface";
	import type { FaceCard } from "./models/types/face-card.type";
	import type { IDeckResponse } from "./models/api/deck-reponse.interface";
	import type { IDrawResponse } from "./models/api/draw-response.interface";
	import type { ICardResponse } from "./models/api/card-response.interface";
	import Hand from "./Hand.svelte";

	let deck: IDeck | undefined;
	let cards: ICard[] = [];
	$: cardsTotal = cards.reduce((total, card) => total + card.point, 0);
	$: console.log(cardsTotal);

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
			.then((result: IDrawResponse) => {
				const newCards: ICard[] = result.cards.map(cardResponse => {
					const { image, value, suit, code }: ICardResponse = cardResponse;
					const point = getCardPoint(value);
					return { image, value, point, suit, code };
				});
				cards = [...cards, ...newCards]
			});
	}

	function getCardPoint(value: FaceCard | string): number {
		if (value === "ACE") {
			return 11;
		} else if (value === "KING" || value === "QUEEN" || value === "JACK") {
			return 10;
		} else {
			return Number(value);
		}
	}
</script>

<main class="app">
	<h1>Blackjack</h1>
	{#if deck}
		<button on:click={dealHand}>
			Deal
		</button>
	{/if}
	<Hand
		cards={cards}
		total={cardsTotal}
	/>
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