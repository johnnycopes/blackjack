import { render, RenderResult } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { EProgress } from "../../src/models/enums/progress.enum";
import Money from "../../src/components/Money.svelte";

const props = {
	bet: 0,
	total: 100,
	progress: EProgress.NewGame
};

describe("on init", () => {
	function checkMoney(result: RenderResult, money: number): HTMLElement {
		return result.getByText("$" + money.toString(), {
			selector: "p",
			exact: false
		});
	}

	it("renders component correctly", () => {
		const result = render(Money, props);
		expect(() => result.getByText("+")).not.toThrow();
		expect(() => result.getByText("-")).not.toThrow();
		expect(() => checkMoney(result, 0)).not.toThrow();
		expect(() => checkMoney(result, 100)).not.toThrow();
		expect(() => result.getByTestId("change")).toThrow();
	});
});

describe("bet change functionality", () => {
	const mockBetChange = jest.fn();
	beforeEach(() => {
		mockBetChange.mockReset();
	});

	it("can increase bet", () => {
		const result = render(Money, props);
		result.component.$on("betChange", mockBetChange);
		const increaseBet = result.getByText("+");
		userEvent.click(increaseBet);
		expect(mockBetChange).toHaveBeenCalled();
	});
	
	it("can't increase bet if bet equals total", () => {
		const result = render(Money, { ...props, bet: 100 });
		result.component.$on("betChange", mockBetChange);
		const increaseBet = result.getByText("+");
		userEvent.click(increaseBet);
		expect(mockBetChange).not.toHaveBeenCalled();
	});
	
	it("can decrease bet", () => {
		const result = render(Money, { ...props, bet: 100 });
		result.component.$on("betChange", mockBetChange);
		const decreaseBet = result.getByText("-");
		userEvent.click(decreaseBet);
		expect(mockBetChange).toHaveBeenCalled();
	});
	
	it("can't decrease bet if bet equals total", () => {
		const result = render(Money, props);
		result.component.$on("betChange", mockBetChange);
		const decreaseBet = result.getByText("-");
		userEvent.click(decreaseBet);
		expect(mockBetChange).not.toHaveBeenCalled();
	});
});

describe("test bet change functionality at different stages of game progress", () => {
	const mockBetChange = jest.fn();
	beforeEach(() => {
		mockBetChange.mockReset();
	});

	it("enables betting functionality while game is not in progress", async () => {
		const result = render(Money, { ...props, progress: EProgress.NewGame });
		result.component.$on("betChange", mockBetChange);
		const increaseBet = result.getByText("+");

		userEvent.click(increaseBet);
		expect(mockBetChange).toHaveBeenCalledTimes(1);

		await result.component.$set({ progress: EProgress.BlackjackDealt });
		userEvent.click(increaseBet);
		expect(mockBetChange).toHaveBeenCalledTimes(2);

		await result.component.$set({ progress: EProgress.GameOver });
		userEvent.click(increaseBet);
		expect(mockBetChange).toHaveBeenCalledTimes(3);
	});

	it("disables betting functionality while game is in progress", async () => {
		const result = render(Money, { ...props, progress: EProgress.PlayerTurn });
		result.component.$on("betChange", mockBetChange);
		const increaseBet = result.getByText("+");

		userEvent.click(increaseBet);
		expect(mockBetChange).not.toHaveBeenCalled();

		await result.component.$set({ progress: EProgress.DealerTurn });
		userEvent.click(increaseBet);
		expect(mockBetChange).not.toHaveBeenCalled();
	});
});

describe("display monetary result after game ends", () => {
	function checkChange(result: RenderResult, change: number): HTMLElement {
		const symbol = change > 0 ? "+" : "-";
		const value = Math.abs(change).toString();
		return result.getByText(symbol + "$" + value, {
			selector: '[data-testid="change"]',
		});
	}

	it("displays gain when player wins", async () => {
		const result = render(Money, {
			bet: 20,
			total: 100,
			progress: EProgress.PlayerTurn
		});
		await result.component.$set({
			bet: 0,
			total: 120,
			progress: EProgress.GameOver
		});
		expect(() => checkChange(result, 20)).not.toThrow();
	});

	it("displays loss when player loses", async () => {
		const result = render(Money, {
			bet: 40,
			total: 100,
			progress: EProgress.PlayerTurn
		});
		await result.component.$set({
			bet: 0,
			total: 60,
			progress: EProgress.GameOver
		});
		expect(() => checkChange(result, -40)).not.toThrow();
	});

	it("displays nothing when there's a push", async () => {
		const result = render(Money, {
			bet: 50,
			total: 100,
			progress: EProgress.PlayerTurn
		});
		await result.component.$set({
			bet: 0,
			total: 100,
			progress: EProgress.GameOver
		});
		expect(() => result.getByTestId("change")).toThrow();
	});
});
