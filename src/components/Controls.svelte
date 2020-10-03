<script lang="ts">
	import { createEventDispatcher } from "svelte";

	export let playing: boolean;
	const dispatcher = createEventDispatcher<{
		deal: void;
		hit: void;
		stand: void;
	}>();
</script>

<div class="controls"
	data-testid="controls"
>
	<button
		disabled={playing}
		on:click={() => dispatcher("deal")}
		>
		Deal
	</button>
	<button
		disabled={!playing}
		on:click={() => dispatcher("hit")}
		>
		Hit
	</button>
	<button
		disabled={!playing}
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