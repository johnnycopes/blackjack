<script lang="ts">
	import { fade, fly } from "svelte/transition";
	import { cubicInOut, sineIn } from "svelte/easing";
	import Card from "./Card.svelte";
	import type { ICard } from "../models/interfaces/card.interface";
	import { addCardsToHand, createHand } from "../functions/gameplay";
	import { wait } from "../functions/utility";

	type HandType = "Player" | "Dealer";

	export let type: "Player" | "Dealer";
	export let cards: ICard[];
	export let total: number;
	export let soft: boolean;
	export let hasHoleCard: boolean = false;
	let visibleTotal: number;
	let showFallbackTotal: boolean;

	$: {
		(async () => {
			await wait(500);
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
		})();
	}

	function cardStyles (type: HandType, index: number): string {
		let x = index * -70;
		let y = index * 10;
		let rotate = 0;
		if (type === "Dealer") {
			rotate = -8 + (index * 3);
		} else if (type === "Player") {
			rotate = 3 + (index * 3);
		}
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
					duration: 175
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
		<li style={cardStyles(type, i)}
			in:fly={{
				opacity: 1,
				x: window.innerWidth / 2,
				y: -window.innerHeight / 2,
				easing: sineIn,
				duration: 350
			}}
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