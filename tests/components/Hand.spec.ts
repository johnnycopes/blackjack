import { render } from "@testing-library/svelte";
import { createFakeHand } from "../../src/functions/debugging";
import Hand from "../../src/components/Hand.svelte";

it("renders hand with no cards", () => {
	const result = render(Hand, createFakeHand());
	expect(() => result.getByTestId("total")).toThrow();
})

it("renders hand with no aces", () => {
	const result = render(Hand, createFakeHand("0D", "4C"));
	expect(() => result.getByText("14")).not.toThrow();
});

it("renders hand with one ace", () => {
	const result = render(Hand, createFakeHand("AH", "3S"));
	expect(() => result.getByText("14 / 4")).not.toThrow();
});

it("renders hand with multiple aces", () => {
	const result = render(Hand, createFakeHand("AC", "3H", "4H", "AS"));
	expect(() => result.getByText("19 / 9")).not.toThrow();
});

it("renders hand with all aces", () => {
	const result = render(Hand, createFakeHand("AS", "AD", "AH"));
	expect(() => result.getByText("13 / 3")).not.toThrow();
});
