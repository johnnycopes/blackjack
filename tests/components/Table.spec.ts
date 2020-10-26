import { render, RenderResult } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { EProgress } from "../../src/models/enums/progress.enum";
import { createFakeHand } from "../../src/functions/debugging";
import Table from "../../src/components/Table.svelte";

let result: RenderResult;

beforeEach(async () => {
	result = render(Table, {
		playerHand: createFakeHand(),
		dealerHand: createFakeHand(),
		progress: EProgress.Betting
	});
	const chip = result.getByRole("button", { name: "$100 chip" });
	await userEvent.click(chip);
});

describe("before starting", () => {
	it("renders table", () => {
		expect(result.getByTestId("bet")).toHaveTextContent("$100");
		expect(result.getByTestId("wallet")).toHaveTextContent("$400");
		expect(result.getByTestId("controls"));
	});

	it("hides controls when no bet is placed", async () => {
		const betChip = result.getAllByRole("button", { name: "$100 chip" })[0];
		await userEvent.click(betChip);
		expect(() => result.getByTestId("controls")).toThrow();
	});
});

describe("gameplay", () => {
	it("shows outcome when player, dealer, or both are dealt 21", async () => {
		await result.component.$set({
			playerHand: createFakeHand("AD", "KC"),
			dealerHand: createFakeHand("5C", "5H"),
			progress: EProgress.BlackjackDealt
		})
		expect(result.getByTestId("outcome")).toHaveTextContent("Blackjack!");
	});

	it("doesn't show outcome when it's player's turn", async () => {
		await result.component.$set({
			playerHand: createFakeHand("0D", "KC"),
			dealerHand: createFakeHand("5C", "5H"),
			progress: EProgress.PlayerTurn
		});
		expect(() => result.getByTestId("outcome")).toThrow();
	});

	it("doesn't show outcome when it's dealer's turn", async () => {
		await result.component.$set({
			playerHand: createFakeHand("0D", "KC"),
			dealerHand: createFakeHand("5C", "5H"),
			progress: EProgress.DealerTurn
		});
		expect(() => result.getByTestId("outcome")).toThrow();
	});

	it("shows outcome when player busts", async () => {
		await result.component.$set({
			playerHand: createFakeHand("0D", "KC", "2C"),
			dealerHand: createFakeHand("5C", "5H"),
			progress: EProgress.GameOver
		});
		expect(result.getByTestId("outcome")).toHaveTextContent("Dealer wins");
	});

	describe("shows outcome when dealer's turn is over", () => {
		it("player wins", async () => {
			await result.component.$set({
				playerHand: createFakeHand("JC", "KC"),
				dealerHand: createFakeHand("JC", "7H"),
				progress: EProgress.GameOver
			});
			expect(result.getByTestId("outcome")).toHaveTextContent("Player wins");
		});
	
		it("dealer wins", async () => {
			await result.component.$set({
				playerHand: createFakeHand("JC", "8C"),
				dealerHand: createFakeHand("JC", "9H"),
				progress: EProgress.GameOver
			});
			expect(result.getByTestId("outcome")).toHaveTextContent("Dealer wins");
		});
	
		it("push", async () => {
			await result.component.$set({
				playerHand: createFakeHand("0D", "8C"),
				dealerHand: createFakeHand("0D", "8C"),
				progress: EProgress.GameOver
			});
			expect(result.getByTestId("outcome")).toHaveTextContent("Push");
		});
	});

});