<script lang="ts">
	import type { ICard } from "../models/interfaces/card.interface";
	import { addCardsToHand, createHand } from "../functions/gameplay";
	import Card from "./Card.svelte";

	export let cards: ICard[];
	export let total: number;
	export let soft: boolean;
	export let hasHoleCard: boolean;
	let visibleTotal: number;
	let showFallbackTotal: boolean;

	$: {
		if (!hasHoleCard) {
			visibleTotal = total;
			showFallbackTotal = soft;
		} else {
			const visibleCards = cards.slice(1);
			const visibleHand = createHand();
			const { total, soft } = addCardsToHand(visibleHand, visibleCards);
			visibleTotal = total;
			showFallbackTotal = soft;
		}
	}
</script>

<div class="hand">
	{#if visibleTotal > 0}
		<h3 class="total"
			data-testid="total"
		>
			{visibleTotal}
			{#if showFallbackTotal}
			/ {visibleTotal - 10}
			{/if}
		</h3>
	{/if}
	<ul class="cards">
		{#each cards as card, i}
		<li style="transform: translateX({i * -75}%);">
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
	}

	.cards {
		display: flex;
		width: var(--card-width)
	}

	.total {
		font-size: 36px;
		margin-bottom: 8px;
	}
</style>