<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { EProgress } from "../models/enums/progress.enum";
	import Button from "./Button.svelte";

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
	<Button
		disabled={!canDeal}
		on:clicked={() => dispatcher("deal")}
	>
		Deal
	</Button>
	<Button
		disabled={!canHit}
		on:clicked={() => dispatcher("hit")}
	>
		Hit
	</Button>
	<Button
		disabled={!canStand}
		on:clicked={() => dispatcher("stand")}
	>
		Stand
	</Button>
</div>

<style>
	.controls {
		display: flex;
		align-items: center;
	}

	.controls :global(.button) {
		margin-right: 8px;
	}
</style>