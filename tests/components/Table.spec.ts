import { prettyDOM, render, RenderResult } from "@testing-library/svelte";
import Table from "../../src/components/Table.svelte";
import { EProgress } from "../../src/models/enums/progress.enum";
import { addCardsToHand, createHand } from "../../src/functions/gameplay";
import userEvent from "@testing-library/user-event";
import { createFakeCard } from "../../src/functions/card";

let result: RenderResult;

describe("before starting", () => {
	beforeEach(() => {
		result = render(Table, {
			playerHand: createHand(),
			dealerHand: createHand(),
			progress: EProgress.NewGame
		});
	})

	it("renders table", () => {
		expect(() => result.getByText("$0 (current bet)")).not.toThrow();
		expect(() => result.getByText("$100 (total money)")).not.toThrow();
		expect(() => result.getByTestId("controls")).toThrow();
	});
	
	it("shows controls after user changes bet to be at least $10", async () => {
		const increaseBet = result.getByText("+");
		await userEvent.click(increaseBet);
		expect(() => result.getByTestId("controls")).not.toThrow();
	});
});

describe("gameplay", () => {
	it("either/both player or dealer is dealt 21", async() => {
		const playerHand = addCardsToHand(
			createHand(),
			[createFakeCard("AD"), createFakeCard("KC")],
		);
		const dealerHand = addCardsToHand(
			createHand(),
			[createFakeCard("5C"), createFakeCard("5H")]
		);
		result = render(Table, {
			playerHand,
			dealerHand,
			progress: EProgress.BlackjackDealt
		});
		expect(() => result.getByText("Blackjack!")).not.toThrow();
	});
});