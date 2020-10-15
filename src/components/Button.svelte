<script lang="ts">
	import { createEventDispatcher } from "svelte";

	export let disabled: boolean;
	const dispatcher = createEventDispatcher<{
		clicked: void;
	}>();
</script>

<button class="button"
	{disabled}
	on:click={() => dispatcher("clicked")}
>
	<slot></slot>
</button>

<style>
	.button {
		height: 64px;
		padding: 0 24px;
		border: 4px solid var(--brown);
		background: var(--white);
		color: var(--black);
		font-family: var(--font);
		outline: none;
		font-size: 20px;
		cursor: pointer;
	}

	.button:disabled {
		background: lightgray;
		color: gray;
		border-color: gray;
		cursor: default;
	}
</style>