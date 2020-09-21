<script lang="ts">
	import { createEventDispatcher } from "svelte";

	export let playing: boolean;
	const clickDispatch = createEventDispatcher();
</script>

<div class="controls">
	<button
		disabled={playing}
		on:click={() => clickDispatch("deal")}
		>
		Deal
	</button>
	<button
		disabled={!playing}
		on:click={() => clickDispatch("hit")}
		>
		Hit
	</button>
	<button
		disabled={!playing}
		on:click={() => clickDispatch("stay")}
		>
		Stay
	</button>
</div>

<style>
	.controls {
		display: flex;
		align-items: center;
		margin-bottom: 8px;
	}

	.controls > * {
		margin-right: 4px;
	}
</style>