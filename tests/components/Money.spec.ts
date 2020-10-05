import { prettyDOM, render, RenderResult } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { EProgress } from "../../src/models/enums/progress.enum";
import Money from "../../src/components/Money.svelte";
import { EOutcome } from "../../src/models/enums/outcome.enum";

let result: RenderResult;
let increaseBet: HTMLElement;
let decreaseBet: HTMLElement;

beforeEach(async () => {
	result = render(Money, {
		progress: EProgress.NewGame,
		outcome: undefined
	});
	increaseBet = result.getByText("+");
	decreaseBet = result.getByText("-");
});

function checkMoney(result: RenderResult, money: number): HTMLElement {
	return result.getByText("$" + money.toString(), {
		selector: "p",
		exact: false
	});
}

function checkAllMoney(result: RenderResult, money: number): HTMLElement[] {
	return result.getAllByText("$" + money.toString(), {
		selector: "p",
		exact: false
	});
}

function checkChange(result: RenderResult, change?: number): HTMLElement {
	if (change) {
		const symbol = change > 0 ? "+" : "-";
		const value = Math.abs(change).toString();
		const strToFind = symbol + "$" + value;
		return result.getByText(strToFind, {
			selector: '[data-testid="change"]',
		});
	}
	return result.getByTestId('[data-testid="change"');
}

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
		expect(checkAllMoney(result, 100)).toHaveLength(2);
		expect(() => checkAllMoney(result, 100)).not.toThrow();
	});

	it("can decrease bet if bet is greater than 0", async () => {
		result.component.$on("betPlaced", e => betPlaced = e.detail);
		await userEvent.click(decreaseBet);
		expect(betPlaced).toEqual(false);
		expect(() => checkMoney(result, 0)).not.toThrow();

		await userEvent.click(increaseBet);
		await userEvent.click(increaseBet);
		await userEvent.click(increaseBet);
		await userEvent.click(decreaseBet);
		expect(betPlaced).toEqual(true);
		expect(() => checkMoney(result, 20)).not.toThrow();
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
		expect(() => checkMoney(result, 130)).not.toThrow();
		expect(() => checkChange(result, 30)).not.toThrow();
	});

	it("subtracts the bet amount from total if dealer gets blackjack", async () => {
		await result.component.$set({
			progress: EProgress.BlackjackDealt,
			outcome: EOutcome.DealerBlackjack
		});
		expect(() => checkMoney(result, 80)).not.toThrow();
		expect(() => checkChange(result, -20)).not.toThrow();
	});

	it("adds the bet amount to total if player wins", async () => {
		await result.component.$set({
			progress: EProgress.GameOver,
			outcome: EOutcome.PlayerWins
		});
		expect(() => checkMoney(result, 120)).not.toThrow();
		expect(() => checkChange(result, 20)).not.toThrow();
	});

	it("adds the bet amount to total if dealer busts", async () => {
		await result.component.$set({
			progress: EProgress.GameOver,
			outcome: EOutcome.DealerBusts
		});
		expect(() => checkMoney(result, 120)).not.toThrow();
		expect(() => checkChange(result, 20)).not.toThrow();
	});

	it("subtracts the bet amount from total if player busts", async () => {
		await result.component.$set({
			progress: EProgress.GameOver,
			outcome: EOutcome.PlayerBusts
		});
		expect(() => checkMoney(result, 80)).not.toThrow();
		expect(() => checkChange(result, -20)).not.toThrow();
	});

	it("subtracts the bet amount from total if dealer wins", async () => {
		await result.component.$set({
			progress: EProgress.GameOver,
			outcome: EOutcome.DealerWins
		});
		expect(() => checkMoney(result, 80)).not.toThrow();
		expect(() => checkChange(result, -20)).not.toThrow();
	});

	it("doesn't change the total if there's a push", async () => {
		await result.component.$set({
			progress: EProgress.GameOver,
			outcome: EOutcome.Push
		});
		expect(() => checkMoney(result, 100)).not.toThrow();
		expect(() => checkChange(result)).toThrow();
	});
});
