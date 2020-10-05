<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { EProgress } from "../models/enums/progress.enum";

	export let progress: EProgress;
	const dispatcher = createEventDispatcher<{
		deal: void;
		hit: void;
		stand: void;
	}>();
	let canDeal: boolean;
	let canHit: boolean;
	let canStand: boolean;

	// Game progress
	$: {
		switch (progress) {
			case EProgress.PlayerTurn:
				canDeal = false;
				canHit = true;
				canStand = true;
				break;
			case EProgress.DealerTurn:
				canDeal = false;
				canHit = false;
				canStand = false;
				break;
			default:
				canDeal = true;
				canHit = false;
				canStand = false;
		}
	}
</script>

<div class="controls"
	data-testid="controls"
>
	<button
		disabled={!canDeal}
		on:click={() => dispatcher("deal")}
		>
		Deal
	</button>
	<button
		disabled={!canHit}
		on:click={() => dispatcher("hit")}
		>
		Hit
	</button>
	<button
		disabled={!canStand}
		on:click={() => dispatcher("stand")}
		>
		Stand
	</button>
</div>

<style>
	.controls {
		display: flex;
		align-items: center;
	}

	.controls > * {
		margin-right: 4px;
	}
</style>