<script lang="ts">
	import { fade, fly } from "svelte/transition";
	import { cubicInOut, sineIn } from "svelte/easing";
	import Card from "./Card.svelte";
	import type { ICard } from "../models/interfaces/card.interface";
	import { EDuration } from "../models/enums/duration.enum";
	import { addCardsToHand, createHand } from "../functions/gameplay";

	export let cards: ICard[];
	export let total: number;
	export let soft: boolean;
	export let hasHoleCard: boolean = false;
	let visibleTotal: number;
	let showFallbackTotal: boolean;

	// Update total when hole card is revealed
	$: {
		setTotal(hasHoleCard);
	}

	function setTotal(hasHoleCard: boolean): void {
		if (!hasHoleCard) {
			visibleTotal = total;
			showFallbackTotal = soft;
		} else {
			const visibleCards = cards.slice(1);
			const visibleHand = createHand();
			const { total, soft } = addCardsToHand(visibleHand, ...visibleCards);
			visibleTotal = total;
			showFallbackTotal = soft;
		}
	}

	function cardStyles (index: number): string {
		const x = index * -70;
		const y = index * 10;
		const rotate = -8 + (index * 3);
		return `transform: translateX(${x}%) translateY(${y}%) rotate(${rotate}deg)`;
	}
</script>

<div class="hand">
	<h3 class="total">
		{#if visibleTotal > 0}
			<span class="total__value"
				data-testid="total"
				in:fade={{
					easing: cubicInOut,
					duration: EDuration.Text
				}}
			>
				{visibleTotal}
				{#if showFallbackTotal}
				/ {visibleTotal - 10}
				{/if}
			</span>
		{/if}
	</h3>
	<ul class="cards">
		{#each cards as card, i}
			<li style={cardStyles(i)}
				transition:fly={{
					opacity: 1,
					x: window.innerWidth / 2,
					y: -window.innerHeight / 2,
					easing: sineIn,
					duration: EDuration.Card
				}}
				on:introend={() => setTotal(hasHoleCard)}
				on:outrostart={() => setTotal(hasHoleCard)}
			>
				<Card
					code={card.code}
					hidden={i === 0 && hasHoleCard}
				/>
			</li>
		{/each}
	</ul>
</div>

<style>
	.hand {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 302px;
	}

	.cards {
		display: flex;
		width: var(--card-width)
	}

	.total {
		font-size: 36px;
		margin-bottom: 8px;
		height: 60px;
	}
</style>