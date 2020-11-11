<script lang="ts">
	import Button from "./Button.svelte";
	import type { ChipValue } from "../models/types/chip-value.type";
	import { images } from "../stores";

	export let disabled: boolean;
	export let value: ChipValue;
	$: src = $images.get(`CHIP_${value}`);
</script>

<Button
	{disabled}
	on:clicked
>
	<img class="chip"
		{src}
		alt="${value} chip"
	/>
</Button>

<style>
	.chip {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 128px;
	}
</style>