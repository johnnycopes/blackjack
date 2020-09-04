<script lang="ts">
	import type { CardCode } from "./models/types/card-code.type";

	export let image: string;
	export let code: CardCode;
</script>

<img class="card"
	src={image}
	alt={code}
>

<style>
	.card {
		width: 128px;
	}
</style>