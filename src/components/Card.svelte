<script lang="ts">
	import type { CardCode } from "../models/types/card-code.type";
	import { EDuration } from "../models/enums/duration.enum";
	import { getSuit, getValue } from "../functions/card";
	import { images } from "../stores";

	export let code: CardCode;
	export let hidden: boolean;
	const backSrc = $images.get("CARD_BACK");
	let cardAlt: string;
	$: name = getName(code);
	$: cardSrc = $images.get(name);
	$: cardAlt = getAltText(name);

	function getName(cardCode: CardCode): string {
		const value = getValue(cardCode);
		const suit = getSuit(cardCode);
		return `${value}_${suit}`;
	}

	function getAltText(name: string) {
		const [number, suit] = name
			.split("_")
			.map(value => value[0] + value.substring(1).toLowerCase());
		return `${number} of ${suit}`;
	}
</script>

<div class="card"
	class:hidden={hidden}
>
	<div class="container"
		style="transition-duration: {EDuration.Card}ms"
	>
		<img class="front"
			src={cardSrc}
			alt={cardAlt}
		>
		<img class="back"
			src={backSrc}
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