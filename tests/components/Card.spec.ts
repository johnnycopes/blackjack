import { render } from "@testing-library/svelte";
import Card from "../../src/components/Card.svelte";

test("render visible card", () => {
	const result = render(Card, {
		hidden: false,
		code: "6S",
		image: "https://deckofcardsapi.com/static/img/6S.png"
	});
	expect(() => result.getByAltText("6S")).not.toThrow();
});

test("render hidden card", () => {
	const result = render(Card, {
		hidden: true,
		code: "6S",
		image: "https://deckofcardsapi.com/static/img/6S.png"
	});
	expect(() => result.getByAltText("Back of card")).not.toThrow();
});
