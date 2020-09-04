<script lang="ts">
	import type { IDeck } from "./models/interfaces/deck.interface";
	import type { ICard } from "./models/interfaces/card.interface";
	import type { FaceCard } from "./models/types/face-card.type";
	import type { IDeckData } from "./models/api/deck-data.interface";
	import type { IDrawData } from "./models/api/draw-data.interface";
	import type { ICardData } from "./models/api/card-data.interface";
	import Hand from "./Hand.svelte";
import { onMount } from "svelte";

	let deck: IDeck | undefined;
	let cards: ICard[] = [];
	$: cardsTotal = cards.reduce((total, card) => total + card.point, 0);
	$: console.log(cardsTotal);

	onMount(async () => {
		const response = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6");
		const data: IDeckData = await response.json();
		deck = {
			id: data.deck_id,
			remaining: data.remaining,
		};
	});

	async function dealHand(): Promise<void> {
		if (!deck) {
			return;
		}
		const response = await fetch(`https://deckofcardsapi.com/api/deck/${deck.id}/draw/?count=2`);
		const data: IDrawData = await response.json();
		const newCards: ICard[] = data.cards.map(cardResponse => {
			const { image, value, suit, code }: ICardData = cardResponse;
			const point = getCardPoint(value);
			return { image, value, point, suit, code };
		});
		cards = [...cards, ...newCards];
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