<script lang="ts">
	import type { CardCode } from "./models/types/card-code.type";

	export let image: string;
	export let code: CardCode;
	export let hidden: boolean;

	const back: string = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.-JqhIKN0XDb5hrBsGVaRRgHaKa%26pid%3DApi&f=1";
</script>

<img class="card"
	src={hidden ? back : image}
	alt={hidden ? "Back of card" : code}
>

<style>
	.card {
		width: 128px;
	}
</style>