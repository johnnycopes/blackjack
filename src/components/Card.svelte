<script lang="ts">
	import type { CardCode } from "../models/types/card-code.type";

	export let code: CardCode;
	export let hidden: boolean;
	let image: string;
	/*
		Static assets get blocked by the browser if they have the word "AD",'
		so the Ace of diamonds SVG file needs to have a different name
	*/
	$: {
		if (code === "AD") {
			image = "img/ADI.svg";
		} else {
			image = `./img/${code}.svg`;
		}
	}
	const back: string = "./img/back-of-card.svg";
</script>

<img class="card"
	src={hidden ? back : image}
	alt={hidden ? "Back of card" : code}
>

<style>
	.card {
		width: var(--card-width);
	}
</style>