<script lang="ts">
	import type { ICard } from "../models/interfaces/card.interface";
	import { addCardsToHand, createHand } from "../functions/gameplay";
	import Card from "./Card.svelte";

	export let cards: ICard[];
	export let total: number;
	export let hidden: boolean;
	export let soft: boolean;
	let visibleTotal: number;
	let showFallbackTotal: boolean;

	$: {
		if (!hidden) {
			visibleTotal = total;
			showFallbackTotal = soft;
		} else {
			const visibleCards = cards.slice(1);
			const visibleHand = createHand(false);
			const { total, soft } = addCardsToHand(visibleHand, visibleCards);
			visibleTotal = total;
			showFallbackTotal = soft;
		}
	}
</script>

<div class="hand">
	{#if visibleTotal > 0}
		<h3 class="total">
			{visibleTotal}
			{#if showFallbackTotal}
			/ {visibleTotal - 10}
			{/if}
		</h3>
	{/if}
	<ul class="cards">
		{#each cards as card, i}
		<li style="transform: translateX({i * -80}%);">
			<Card
				image={card.image}
				code={card.code}
				hidden={i === 0 && hidden}
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
		width: 128px;
	}

	.total {
		margin-bottom: 8px;
	}

	.cards {
		display: flex;
	}
	
</style>