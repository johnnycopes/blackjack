import { prettyDOM, render, RenderResult } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import Table from "../../src/components/Table.svelte";
import { EProgress } from "../../src/models/enums/progress.enum";
import { createFakeHand } from "../../src/functions/debugging";

let result: RenderResult;

describe("before starting", () => {
	beforeEach(() => {
		result = render(Table, {
			playerHand: createFakeHand(),
			dealerHand: createFakeHand(),
			progress: EProgress.NewGame
		});
	})

	// it("renders table", () => {
	// 	expect(() => result.getByText("$0 (current bet)")).not.toThrow();
	// 	expect(() => result.getByText("$100 (total money)")).not.toThrow();
	// 	expect(() => result.getByTestId("controls")).toThrow();
	// });
	
	// it("shows controls after user changes bet to be at least $10", async () => {
	// 	const increaseBet = result.getByText("+");
	// 	await userEvent.click(increaseBet);
	// 	expect(() => result.getByTestId("controls")).not.toThrow();
	// });
});

describe("gameplay", () => {
	it("shows outcome when player, dealer, or both are dealt 21", async() => {
		const playerHand = createFakeHand("AD", "KC");
		const dealerHand = createFakeHand("5C", "5H");
		result = render(Table, {
			playerHand,
			dealerHand,
			progress: EProgress.BlackjackDealt
		});
		expect(() => result.getByText("Blackjack!")).not.toThrow();
	});

	// it("doesn't show outcome when player and dealer are dealt regular hands", async() => {
	// 	const playerHand = createFakeHand("AD", "KC");
	// 	const dealerHand = createFakeHand("5C", "5H");
	// 	result = render(Table, {
	// 		playerHand,
	// 		dealerHand,
	// 		progress: EProgress.BlackjackDealt
	// 	});
	// 	expect(() => result.getByText("Blackjack!")).not.toThrow();
	// });
});