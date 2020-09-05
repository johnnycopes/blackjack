<script lang="ts">
	import type { IDeck } from "./models/interfaces/deck.interface";
	import type { ICard } from "./models/interfaces/card.interface";
	import type { FaceCard } from "./models/types/face-card.type";
	import type { IDeckData } from "./models/api/deck-data.interface";
	import type { IDrawData } from "./models/api/draw-data.interface";
	import type { ICardData } from "./models/api/card-data.interface";
	import Hand from "./Hand.svelte";
	import { onMount } from "svelte";

	interface IDealtCards {
		player: ICard[];
		dealer: ICard[];
	}

	let playing: boolean = false;
	let deck: IDeck | undefined;
	let playerCards: ICard[] = [];
	let dealerCards: ICard[] = [];
	$: playerTotal = getHandTotal(playerCards);
	$: dealerTotal = getHandTotal(dealerCards);

	onMount(async () => {
		const response = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6");
		const data: IDeckData = await response.json();
		deck = {
			id: data.deck_id,
			remaining: data.remaining,
		};
	});

	async function dealHand(): Promise<void> {
		playing = true;
		const response = await fetch(`https://deckofcardsapi.com/api/deck/${deck.id}/draw/?count=4`);
		const data: IDrawData = await response.json();
		const newCards: IDealtCards = data.cards.reduce((accum, cardResponse, index) => {
			const { image, value, suit, code }: ICardData = cardResponse;
			const point = getCardPoint(value);
			const newCard = { image, value, point, suit, code };
			if ((index + 1) % 2 === 0) {
				accum.dealer.push(newCard);
			} else {
				accum.player.push(newCard);
			}
			return accum;
		}, { player: [] as ICard[], dealer: [] as ICard[] });
		playerCards = [...playerCards, ...newCards.player];
		dealerCards = [...dealerCards, ...newCards.dealer];
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

	function getHandTotal(cards: ICard[]): number {
		return cards.reduce((total, card) => total + card.point, 0);
	}
</script>

<main class="app">
	<h1>Blackjack</h1>
	{#if deck}
		<button
			disabled={playing}
			on:click={dealHand}
		>
			Deal
		</button>
	{/if}
	<div class="table">
		<Hand
			cards={dealerCards}
			total={dealerTotal}
		/>
		<Hand
			cards={playerCards}
			total={playerTotal}
		/>
	</div>
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