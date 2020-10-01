import { render, RenderResult } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import Money from "../../src/components/Money.svelte";

function getByMoney(result: RenderResult, money: number): HTMLElement {
	return result.getByText("$" + money.toString(), { exact: false });
}

const mockBetChange = jest.fn();
const props = {
	bet: 0,
	total: 100,
	disabled: false
};

beforeEach(() => {
	mockBetChange.mockReset();
});

test("renders component", () => {
	const result = render(Money, props);
	expect(() => result.getByText("+")).not.toThrow();
	expect(() => result.getByText("-")).not.toThrow();
	expect(() => getByMoney(result, 0)).not.toThrow();
	expect(() => getByMoney(result, 100)).not.toThrow();
});

describe("adjust bet", () => {
	test("can increase bet", () => {
		const result = render(Money, props);
		result.component.$on("betChange", mockBetChange);
		const increaseBet = result.getByText("+");
		userEvent.click(increaseBet);
		expect(mockBetChange).toHaveBeenCalled();
	});
	
	test("can't increase bet if bet equals total", () => {
		const result = render(Money, { ...props, bet: 100 });
		result.component.$on("betChange", mockBetChange);
		const increaseBet = result.getByText("+");
		userEvent.click(increaseBet);
		expect(mockBetChange).not.toHaveBeenCalled();
	});
	
	test("can decrease bet", () => {
		const result = render(Money, { ...props, bet: 100 });
		result.component.$on("betChange", mockBetChange);
		const decreaseBet = result.getByText("-");
		userEvent.click(decreaseBet);
		expect(mockBetChange).toHaveBeenCalled();
	});
	
	test("can't decrease bet if bet equals total", () => {
		const result = render(Money, props);
		result.component.$on("betChange", mockBetChange);
		const decreaseBet = result.getByText("-");
		userEvent.click(decreaseBet);
		expect(mockBetChange).not.toHaveBeenCalled();
	});
})
