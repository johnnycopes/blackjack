import { render } from "@testing-library/svelte";
import { createFakeHand } from "../../src/functions/debugging";
import Hand from "../../src/components/Hand.svelte";
import { getControls } from "../queries";

describe("normal hand (no hole card)", () => {
	it("renders hand with no cards", () => {
		const props = { ...createFakeHand(), hasHoleCard: false };
		const result = render(Hand, props);
		expect(() => getControls(result)).toThrow();
	})
	
	it("renders hand with no aces", () => {
		const props = { ...createFakeHand("0D", "4C"), hasHoleCard: false };
		const result = render(Hand, props);
		expect(result.getByText("14"));
	});
	
	it("renders hand with one ace", () => {
		const props = { ...createFakeHand("AH", "3S"), hasHoleCard: false };
		const result = render(Hand, props);
		expect(result.getByText("14 / 4"));
	});
	
	it("renders hand with multiple aces", () => {
		const props = { ...createFakeHand("AC", "3H", "4H", "AS"), hasHoleCard: false };
		const result = render(Hand, props);
		expect(result.getByText("19 / 9"));
	});
	
	it("renders hand with all aces", () => {
		const props = { ...createFakeHand("AS", "AD", "AH"), hasHoleCard: false };
		const result = render(Hand, props);
		expect(result.getByText("13 / 3"));
	});
})

describe("partially hidden hand (has hole card)", () => {
	it("renders hand with no cards", () => {
		const props = { ...createFakeHand(), hasHoleCard: true };
		const result = render(Hand, props);
		expect(() => getControls(result)).toThrow();
	});

	it("renders hand with no aces", () => {
		const props = { ...createFakeHand("0D", "4C"), hasHoleCard: true };
		const result = render(Hand, props);
		expect(result.getByText("4"));
	});

	it("renders hand with one ace visible", () => {
		const props = { ...createFakeHand("AH", "3S"), hasHoleCard: true };
		const result = render(Hand, props);
		expect(result.getByText("3"));
	});

	it("renders hand with one ace hidden", () => {
		const props = { ...createFakeHand("3S", "AH"), hasHoleCard: true };
		const result = render(Hand, props);
		expect(result.getByText("11 / 1"));
	});

	it("renders hand with multiple aces", () => {
		const props = { ...createFakeHand("AC", "3H", "4H", "AS"), hasHoleCard: true };
		const result = render(Hand, props);
		expect(result.getByText("18 / 8"));
	});

	it("renders hand with all aces", () => {
		const props = { ...createFakeHand("AS", "AD", "AH"), hasHoleCard: true };
		const result = render(Hand, props);
		expect(result.getByText("12 / 2"));
	});
});
