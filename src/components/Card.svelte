<script lang="ts">
	import type { CardCode } from "../models/types/card-code.type";
	import { EDuration } from "../models/enums/duration.enum";
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

<div class="card"
	class:hidden={hidden}
>
	<div class="container"
		style="transition-duration: {EDuration.Card}ms"
	>
		<img class="front"
			src={imagePath}
			alt={imageName}
		>
		<img class="back"
			src={back}
			alt="Back of card"
		/>
	</div>
</div>


<style>
	.card {
		width: var(--card-width);
		height: 223px;
		perspective: 1000px;
	}

	.container {
		position: relative;
		width: 100%;
		height: 100%;
		transition-property: transform;
		transform-style: preserve-3d;
	}

	.card.hidden .container {
		transform: rotateY(180deg);
	}

	.front,
	.back {
		position: absolute;
		width: 100%;
		height: 100%;
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
	}

	.back {
		transform: rotateY(180deg);
	}
</style>