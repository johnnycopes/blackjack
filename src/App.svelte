<script lang="ts">
	import type { IDeck } from "./models/interfaces/deck.interface";
	import type { IHand } from "./models/interfaces/hand.interface";
	import type { ICard } from "./models/interfaces/card.interface";
	import type { FaceCard } from "./models/types/face-card.type";
	import type { IDeckData } from "./models/api/deck-data.interface";
	import type { IDrawData } from "./models/api/draw-data.interface";
	import type { ICardData } from "./models/api/card-data.interface";
	import { EOutcome } from "./models/enums/outcome.enum";
	import Hand from "./Hand.svelte";
	import { onMount } from "svelte";
	import { wait } from "./utility/wait";

	interface IDealtCards {
		player: ICard[];
		dealer: ICard[];
	}

	let playing: boolean = false;
	let outcome: EOutcome | undefined;
	let deck: IDeck | undefined;
	let playerHand: IHand = createHand();
	let dealerHand: IHand = createHand();

	// Current game starts
	$: {
		if (playerHand.cards.length === 2 && dealerHand.cards.length === 2) {
			checkForBlackjack();
		}
		if (playerHand.total > 21) {
			outcome = EOutcome.PlayerBusts;
		}
	};

	// Current game ends
	$: {
		if (playing && outcome) {
			playing = false;
		}
	}

	onMount(async () => {
		const response = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6");
		// const response = await fetch(`https://deckofcardsapi.com/api/deck/new/?cards=AS,8S,AD,8D,AC,7C,6C,5C,4C,4D,3H`);
		const data: IDeckData = await response.json();
		deck = {
			id: data.deck_id,
			remaining: data.remaining,
		};
	});

	async function dealHand(): Promise<void> {
		resetState();
		const response = await fetch(`https://deckofcardsapi.com/api/deck/${deck?.id}/draw/?count=4`);
		const data: IDrawData = await response.json();
		const newCards: IDealtCards = data.cards.reduce((accum, cardResponse, index) => {
			const newCard = createCard(cardResponse);
			if ((index + 1) % 2 === 0) {
				accum.dealer.push(newCard);
			} else {
				accum.player.push(newCard);
			}
			return accum;
		}, { player: [] as ICard[], dealer: [] as ICard[] });
		dealerHand = addCardsToHand(dealerHand, newCards.dealer);
		playerHand = addCardsToHand(playerHand, newCards.player);
	}

	async function hit(): Promise<void> {
		const newCard = await drawCardFromDeck();
		playerHand = addCardsToHand(playerHand, [newCard]);
	}

	async function stay(): Promise<void> {
		while (dealerHand.total <= 17) {
			const newCard = await drawCardFromDeck();
			dealerHand = addCardsToHand(dealerHand, [newCard]);
			await wait(700);
		}
		evaluateOutcome();
	}

	function checkForBlackjack(): void {
		const playerTotal = playerHand.total;
		const dealerTotal = dealerHand.total;
		if (playerTotal === 21 && dealerTotal === 21) {
			outcome = EOutcome.Push;
		} else if (playerTotal === 21) {
			outcome = EOutcome.Blackjack;
		} else if (dealerTotal === 21) {
			outcome = EOutcome.DealerWins;
		}
	}

	function evaluateOutcome(): void {
		const playerTotal = playerHand.total;
		const dealerTotal = dealerHand.total;
		if (dealerTotal > 21) {
			outcome = EOutcome.DealerBusts
		} else if (playerTotal > dealerTotal) {
			outcome = EOutcome.PlayerWins;
		} else if (playerTotal < dealerTotal) {
			outcome = EOutcome.DealerWins;
		} else {
			outcome = EOutcome.Push;
		}
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

	function addCardsToHand(hand: IHand, newCards: ICard[]): IHand {
		const cards = [...hand.cards, ...newCards];
		let numberOfAces = cards.filter(card => card.value === "ACE").length;
		let total = cards.reduce((total, card) => total + card.point, 0);
		console.log(total, numberOfAces);
		while (total > 21 && numberOfAces > 0) {
			total -= 10;
			numberOfAces--;
		}
		console.log(total, numberOfAces);
		const soft = !!numberOfAces;
		return { cards, total, soft };
	}

	async function drawCardFromDeck(): Promise<ICard> {
		const response = await fetch(`https://deckofcardsapi.com/api/deck/${deck?.id}/draw/?count=1`);
		const data: IDrawData = await response.json();
		return createCard(data.cards[0]);
	}

	function createHand(): IHand {
		return {
			cards: [],
			total: 0,
			soft: false,
		};
	}

	function createCard(cardResponse: ICardData): ICard {
		const { image, value, suit, code }: ICardData = cardResponse;
		const point = getCardPoint(value);
		const newCard = { image, value, point, suit, code };
		return newCard;
	}

	function resetState(): void {
		outcome = undefined;
		playerHand = createHand();
		dealerHand = createHand();
		playing = true;
	}
</script>

<main class="app">
	{#if deck}
		<button
			disabled={playing}
			on:click={dealHand}
		>
			Deal
		</button>
		<button
			disabled={!playing}
			on:click={hit}
		>
			Hit
		</button>
		<button
			disabled={!playing}
			on:click={stay}
		>
			Stay
		</button>
	{/if}
	<div class="table">
		<Hand {...dealerHand} />
		<Hand {...playerHand} />
		{#if outcome}
			<h2 class="outcome">
				{outcome}
			</h2>
		{/if}
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

	.outcome {
		margin-top: 16px;
	}
</style>