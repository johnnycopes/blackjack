<script lang="ts">
	import type { ICard } from "./models/interfaces/card.interface";
	import Card from "./Card.svelte";

	export let cards: ICard[];
	export let total: number;
	export let soft: boolean;
</script>

{#if total > 0}
	<h3 class="total">
		{total}
		{#if soft}
		/ {total - 10}
		{/if}
	</h3>
{/if}
<ul class="cards">
	{#each cards as card}
	<li class="card">
		<Card
			image={card.image}
			code={card.code}
		/>
	</li>
	{/each}
</ul>

<style>
	.total {
		margin-bottom: 4px;
	}

	.cards {
		display: flex;
	}

	.card {
		margin-right: 8px;
	}
</style>