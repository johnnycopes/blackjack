import { render } from "@testing-library/svelte";
import { createFakeCard } from "../../src/functions/card";
import { addCardsToHand, createHand } from "../../src/functions/gameplay";
import Hand from "../../src/components/Hand.svelte";

const cardAce = createFakeCard("AH");
const card10 = createFakeCard("0D");
const card4 = createFakeCard("4H");
const card3 = createFakeCard("3C");

describe("visible hand", () => {
	test("render hand with no aces", () => {
		const newHand = createHand(false);
		const updatedHand = addCardsToHand(newHand, [card10, card3]);
		const result = render(Hand, { props: updatedHand });
		expect(() => result.getByText("13")).not.toThrow();
	});

	test("render hand with one ace", () => {
		const newHand = createHand(false);
		const updatedHand = addCardsToHand(newHand, [cardAce, card3]);
		const result = render(Hand, { props: updatedHand });
		expect(() => result.getByText("14 / 4")).not.toThrow();
	});

	test("render hand with multiple aces", () => {
		const newHand = createHand(false);
		const updatedHand = addCardsToHand(newHand, [cardAce, card3, card4, cardAce]);
		const result = render(Hand, { props: updatedHand });
		expect(() => result.getByText("19 / 9")).not.toThrow();
	});
});

describe("hidden hand", () => {
	test("render hand with no aces", () => {
		const newHand = createHand(true);
		const updatedHand = addCardsToHand(newHand, [card10, card3]);
		const result = render(Hand, { props: updatedHand });
		expect(() => result.getByText("3")).not.toThrow();
	});

	test("render hand with hidden ace", () => {
		const newHand = createHand(true);
		const updatedHand = addCardsToHand(newHand, [cardAce, card3]);
		const result = render(Hand, { props: updatedHand });
		expect(() => result.getByText("3")).not.toThrow();
	});

	test("render hand with one ace visible", () => {
		const newHand = createHand(true);
		const updatedHand = addCardsToHand(newHand, [card3, cardAce]);
		const result = render(Hand, { props: updatedHand });
		expect(() => result.getByText("11 / 1")).not.toThrow();
	});

	test("render hand with multiple aces visible", () => {
		const newHand = createHand(true);
		const updatedHand = addCardsToHand(newHand, [card3, cardAce, card4, cardAce]);
		const result = render(Hand, { props: updatedHand });
		expect(() => result.getByText("16 / 6")).not.toThrow();
	});

	test("render hand with all aces", () => {
		const newHand = createHand(true);
		const updatedHand = addCardsToHand(newHand, [cardAce, cardAce, cardAce]);
		const result = render(Hand, { props: updatedHand });
		expect(() => result.getByText("12 / 2")).not.toThrow();
	});
});