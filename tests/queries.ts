import type { RenderResult } from "@testing-library/svelte";

export function getControls(result: RenderResult): HTMLElement {
	return result.getByTestId("controls");
}

export function getOutcome(result: RenderResult): HTMLElement {
	return result.getByTestId("outcome");
}

export function getChange(result: RenderResult, change?: number): HTMLElement {
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

export function getByMoney(result: RenderResult, money: number): HTMLElement {
	return result.getByText("$" + money.toString(), {
		selector: "p",
		exact: false
	});
}

export function getAllByMoney(result: RenderResult, money: number): HTMLElement[] {
	return result.getAllByText("$" + money.toString(), {
		selector: "p",
		exact: false
	});
}