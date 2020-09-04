<script lang="ts">
	import type { ICard } from "./models/interfaces/card.interface";
	import Card from "./Card.svelte";

	export let cards: ICard[] = [];
	export let total: number;
</script>

<ul>
	{#if total > 0}
		<p>Total: {total}</p>
	{/if}
	{#each cards as card}
		<Card
			image={card.image}
			code={card.code}
		/>
	{/each}
</ul>

<style>

</style>