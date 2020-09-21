<script lang="ts">
	import type { ICard } from "../models/interfaces/card.interface";
	import Card from "./Card.svelte";

	export let cards: ICard[];
	export let total: number;
	export let hidden: boolean;
	export let soft: boolean;
</script>

<div class="hand">
	{#if total > 0}
		<h3 class="total">
			{hidden ? cards[1].point : total}
			{#if soft && !hidden}
			/ {total - 10}
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