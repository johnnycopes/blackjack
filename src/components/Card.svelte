<script lang="ts">
	import type { CardCode } from "../models/types/card-code.type";

	export let code: CardCode;
	export let hidden: boolean;
	$: image = `./img/${code}.svg`;
	
	const back: string = "./img/back-of-card.svg";
</script>

<img class="card"
	src={hidden ? back : image}
	alt={hidden ? "Back of card" : code}
>

<style>
	.card {
		width: 192px;
	}
</style>