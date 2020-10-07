import { prettyDOM, render, RenderResult } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { EProgress } from "../../src/models/enums/progress.enum";
import Money from "../../src/components/Money.svelte";
import { EOutcome } from "../../src/models/enums/outcome.enum";
import { getAllByMoney, getChange, getByMoney } from "../queries";

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
		expect(getAllByMoney(result, 100)).toHaveLength(2);
	});

	it("can decrease bet if bet is greater than 0", async () => {
		result.component.$on("betPlaced", e => betPlaced = e.detail);
		await userEvent.click(decreaseBet);
		expect(betPlaced).toEqual(false);
		expect(getByMoney(result, 0));

		await userEvent.click(increaseBet);
		await userEvent.click(increaseBet);
		await userEvent.click(increaseBet);
		await userEvent.click(decreaseBet);
		expect(betPlaced).toEqual(true);
		expect(getByMoney(result, 20));
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
		expect(getByMoney(result, 130));
		expect(getChange(result, 30));
	});

	it("subtracts the bet amount from total if dealer gets blackjack", async () => {
		await result.component.$set({
			progress: EProgress.BlackjackDealt,
			outcome: EOutcome.DealerBlackjack
		});
		expect(getByMoney(result, 80));
		expect(getChange(result, -20));
	});

	it("adds the bet amount to total if player wins", async () => {
		await result.component.$set({
			progress: EProgress.GameOver,
			outcome: EOutcome.PlayerWins
		});
		expect(getByMoney(result, 120));
		expect(getChange(result, 20));
	});

	it("adds the bet amount to total if dealer busts", async () => {
		await result.component.$set({
			progress: EProgress.GameOver,
			outcome: EOutcome.DealerBusts
		});
		expect(getByMoney(result, 120));
		expect(getChange(result, 20));
	});

	it("subtracts the bet amount from total if player busts", async () => {
		await result.component.$set({
			progress: EProgress.GameOver,
			outcome: EOutcome.PlayerBusts
		});
		expect(getByMoney(result, 80));
		expect(getChange(result, -20));
	});

	it("subtracts the bet amount from total if dealer wins", async () => {
		await result.component.$set({
			progress: EProgress.GameOver,
			outcome: EOutcome.DealerWins
		});
		expect(getByMoney(result, 80));
		expect(getChange(result, -20));
	});

	it("doesn't change the total if there's a push", async () => {
		await result.component.$set({
			progress: EProgress.GameOver,
			outcome: EOutcome.Push
		});
		expect(getByMoney(result, 100));
		expect(() => getChange(result)).toThrow();
	});
});
