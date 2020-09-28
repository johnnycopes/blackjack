import { render } from "@testing-library/svelte";
import Card from "../../src/components/Card.svelte";

const props = {
	hidden: false,
	code: "6S",
	image: "https://deckofcardsapi.com/static/img/6S.png"
};

test("render visible card", () => {
	const result = render(Card, props);
	expect(() => result.getByAltText("6S")).not.toThrow();
});

test("render hidden card", async () => {
	const result = render(Card, { ...props, hidden: true });
	expect(() => result.getByAltText("Back of card")).not.toThrow();
});
