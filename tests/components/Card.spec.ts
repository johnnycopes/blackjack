import { render } from "@testing-library/svelte";
import Card from "../../src/components/Card.svelte";

it("renders visible card", () => {
	const result = render(Card, {
		hidden: false,
		code: "6S",
	});
	expect(result.getByAltText("6S"));
});

it("renders hidden card", () => {
	const result = render(Card, {
		hidden: true,
		code: "6S",
	});
	expect(result.getByAltText("Back of card"));
});
