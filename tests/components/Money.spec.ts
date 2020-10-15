import { render, RenderResult } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { EProgress } from "../../src/models/enums/progress.enum";
import { EOutcome } from "../../src/models/enums/outcome.enum";
import Money from "../../src/components/Money.svelte";

let result: RenderResult;
let increaseBet: HTMLElement;
let decreaseBet: HTMLElement;

function moneyChangePattern(change: number): RegExp {
	const symbol = change > 0 ? "\\+" : "-";
	const value = Math.abs(change).toString();
	const str = `^${symbol}\\\$${value}$`;
	return new RegExp(str);
}

beforeEach(async () => {
	result = render(Money, {
		progress: EProgress.NewGame,
		outcome: undefined
	});
	increaseBet = result.getByText("+");
	decreaseBet = result.getByText("-");
});

describe("bet change functionality", () => {
	const mockBetPlaced = jest.fn();
	let betPlaced: boolean = false;

	beforeEach(() => {
		betPlaced = false;
		mockBetPlaced.mockReset();
	});

	it("can increase bet if bet is less than total", async () => {
		result.component.$on("betPlaced", e => betPlaced = e.detail);
		await userEvent.click(increaseBet);
		expect(betPlaced).toEqual(true);

		for (let i = 0; i < 20; i++) {
			await userEvent.click(increaseBet);
		}
		expect(result.getAllByText("$100", { exact: false})).toHaveLength(2);
	});

	it("can decrease bet if bet is greater than 0", async () => {
		result.component.$on("betPlaced", e => betPlaced = e.detail);
		await userEvent.click(decreaseBet);
		expect(betPlaced).toEqual(false);
		expect(result.getByText("$0 (current bet)"));

		await userEvent.click(increaseBet);
		await userEvent.click(increaseBet);
		await userEvent.click(increaseBet);
		await userEvent.click(decreaseBet);
		expect(betPlaced).toEqual(true);
		expect(result.getByText("$20 (current bet)"));
		expect(() => result.getByTestId("change")).toThrow();
	});
});

describe("updates money depending on outcome", () => {
	beforeEach(async () => {
		userEvent.click(increaseBet);
		userEvent.click(increaseBet);
	});

	it("adds 1.5x the bet amount to total if player gets blackjack", async () => {
		await result.component.$set({
			progress: EProgress.BlackjackDealt,
			outcome: EOutcome.PlayerBlackjack
		});
		expect(result.getByText("$130 (total money)"));
		expect(result.getByTestId("change")).toHaveTextContent(moneyChangePattern(30));
	});

	it("subtracts the bet amount from total if dealer gets blackjack", async () => {
		await result.component.$set({
			progress: EProgress.BlackjackDealt,
			outcome: EOutcome.DealerBlackjack
		});
		expect(result.getByText("$80 (total money)"));
		expect(result.getByTestId("change")).toHaveTextContent(moneyChangePattern(-20));
	});

	it("adds the bet amount to total if player wins", async () => {
		await result.component.$set({
			progress: EProgress.GameOver,
			outcome: EOutcome.PlayerWins
		});
		expect(result.getByText("$120 (total money)"));
		expect(result.getByTestId("change")).toHaveTextContent(moneyChangePattern(20));
	});

	it("adds the bet amount to total if dealer busts", async () => {
		await result.component.$set({
			progress: EProgress.GameOver,
			outcome: EOutcome.DealerBusts
		});
		expect(result.getByText("$120 (total money)"));
		expect(result.getByTestId("change")).toHaveTextContent(moneyChangePattern(20));
	});

	it("subtracts the bet amount from total if player busts", async () => {
		await result.component.$set({
			progress: EProgress.GameOver,
			outcome: EOutcome.PlayerBusts
		});
		expect(result.getByText("$80 (total money)"));
		expect(result.getByTestId("change")).toHaveTextContent(moneyChangePattern(-20));
	});

	it("subtracts the bet amount from total if dealer wins", async () => {
		await result.component.$set({
			progress: EProgress.GameOver,
			outcome: EOutcome.DealerWins
		});
		expect(result.getByText("$80 (total money)"));
		expect(result.getByTestId("change")).toHaveTextContent(moneyChangePattern(-20));
	});

	it("doesn't change the total if there's a push", async () => {
		await result.component.$set({
			progress: EProgress.GameOver,
			outcome: EOutcome.Push
		});
		expect(result.getByText("$100 (total money)"));
		expect(() => result.getByTestId("change")).toThrow();
	});
});
