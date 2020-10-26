import { render, RenderResult } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { EProgress } from "../../src/models/enums/progress.enum";
import { EOutcome } from "../../src/models/enums/outcome.enum";
import Money from "../../src/components/Money.svelte";

let result: RenderResult;
let chip: HTMLElement;

beforeEach(async () => {
	result = render(Money, {
		progress: EProgress.Betting,
		outcome: undefined
	});
	chip = result.getByRole("button", { name: "$100 chip" });
});

describe("updates money depending on outcome", () => {
	beforeEach(async () => {
		await userEvent.click(chip);
	});

	it("adds 1.5x the bet amount to total if player gets blackjack", async () => {
		await result.component.$set({
			progress: EProgress.BlackjackDealt,
			outcome: EOutcome.PlayerBlackjack
		});
		expect(result.getByTestId("bet")).toBeEmptyDOMElement();
		expect(result.getByTestId("wallet")).toHaveTextContent("$650");
	});

	it("subtracts the bet amount from total if dealer gets blackjack", async () => {
		await result.component.$set({
			progress: EProgress.BlackjackDealt,
			outcome: EOutcome.DealerBlackjack
		});
		expect(result.getByTestId("bet")).toBeEmptyDOMElement();
		expect(result.getByTestId("wallet")).toHaveTextContent("$400");
	});

	it("adds the bet amount to total if player wins", async () => {
		await result.component.$set({
			progress: EProgress.GameOver,
			outcome: EOutcome.PlayerWins
		});
		expect(result.getByTestId("bet")).toBeEmptyDOMElement();
		expect(result.getByTestId("wallet")).toHaveTextContent("$600");
	});

	it("adds the bet amount to total if dealer busts", async () => {
		await result.component.$set({
			progress: EProgress.GameOver,
			outcome: EOutcome.DealerBusts
		});
		expect(result.getByTestId("bet")).toBeEmptyDOMElement();
		expect(result.getByTestId("wallet")).toHaveTextContent("$600");
	});

	it("subtracts the bet amount from total if player busts", async () => {
		await result.component.$set({
			progress: EProgress.GameOver,
			outcome: EOutcome.PlayerBusts
		});
		expect(result.getByTestId("bet")).toBeEmptyDOMElement();
		expect(result.getByTestId("wallet")).toHaveTextContent("$400");
	});

	it("subtracts the bet amount from total if dealer wins", async () => {
		await result.component.$set({
			progress: EProgress.GameOver,
			outcome: EOutcome.DealerWins
		});
		expect(result.getByTestId("bet")).toBeEmptyDOMElement();
		expect(result.getByTestId("wallet")).toHaveTextContent("$400");
	});

	it("doesn't change the total if there's a push", async () => {
		await result.component.$set({
			progress: EProgress.GameOver,
			outcome: EOutcome.Push
		});
		expect(result.getByTestId("bet")).toBeEmptyDOMElement();
		expect(result.getByTestId("wallet")).toHaveTextContent("$500");
	});
});
