import { render } from "@testing-library/svelte";
import { createFakeCard } from "../../src/functions/card";
import { addCardsToHand, createHand } from "../../src/functions/gameplay";
import Hand from "../../src/components/Hand.svelte";

const cardAce = createFakeCard("AH");
const card10 = createFakeCard("0D");
const card4 = createFakeCard("4H");
const card3 = createFakeCard("3C");

it("renders hand with no cards", () => {
	const hand = createHand();
	const result = render(Hand, hand);
	expect(() => result.getByTestId("total")).toThrow();
})

it("renders hand with no aces", () => {
	const hand = createHand();
	const updatedHand = addCardsToHand(hand, [card10, card4]);
	const result = render(Hand, updatedHand);
	expect(() => result.getByText("14")).not.toThrow();
});

it("renders hand with one ace", () => {
	const hand = createHand();
	const updatedHand = addCardsToHand(hand, [cardAce, card3]);
	const result = render(Hand, updatedHand);
	expect(() => result.getByText("14 / 4")).not.toThrow();
});

it("renders hand with multiple aces", () => {
	const hand = createHand();
	const updatedHand = addCardsToHand(hand, [cardAce, card3, card4, cardAce]);
	const result = render(Hand, updatedHand);
	expect(() => result.getByText("19 / 9")).not.toThrow();
});

it("renders hand with all aces", () => {
	const hand = createHand();
	const updatedHand = addCardsToHand(hand, [cardAce, cardAce, cardAce]);
	const result = render(Hand, updatedHand);
	expect(() => result.getByText("13 / 3")).not.toThrow();
});
