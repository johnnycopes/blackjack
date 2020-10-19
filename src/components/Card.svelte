<script lang="ts">
	import type { CardCode } from "../models/types/card-code.type";
	import { getSuit, getValue } from "../functions/card";

	export let code: CardCode;
	export let hidden: boolean;
	$: imageName = getImageName(code);
	$: imagePath = `./assets/cards/${imageName}.png`;
	const back: string = "./assets/cards/backdesign_8.png";

	function getImageName(cardCode: CardCode): string {
		const value = getValue(cardCode).toLowerCase();
		const suit = getSuit(cardCode).toLowerCase();
		return `${value}_${suit}`;
	}
</script>

<img class="card"
	src={hidden ? back : imagePath}
	alt={hidden ? "Back of card" : imageName}
>

<style>
	.card {
		width: var(--card-width);
	}
</style>