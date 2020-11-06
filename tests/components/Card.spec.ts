import { render } from "@testing-library/svelte";
import Card from "../../src/components/Card.svelte";

describe("renders visible card", () => {
	it("single digit number card", () => {
		const result = render(Card, {
			hidden: false,
			code: "6S",
		});
		expect(result.getAllByAltText("6 of Spades"));
	});

	it("double-digit number card", () => {
		const result = render(Card, {
			hidden: false,
			code: "0H",
		});
		expect(result.getAllByAltText("10 of Hearts"));
	});

	it("face card", () => {
		const result = render(Card, {
			hidden: false,
			code: "QD",
		});
		expect(result.getAllByAltText("Queen of Diamonds"));
	});

	it("ace card", () => {
		const result = render(Card, {
			hidden: false,
			code: "AC",
		});
		expect(result.getAllByAltText("Ace of Clubs"));
	});
});

it("renders hidden card", () => {
	const result = render(Card, {
		hidden: true,
		code: "6S",
	});
	expect(result.getByAltText("Back of card"));
});