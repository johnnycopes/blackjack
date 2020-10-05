import { render, RenderResult } from "@testing-library/svelte";
import userEvent from '@testing-library/user-event'
import { EProgress } from "../../src/models/enums/progress.enum";
import Controls from "../../src/components/Controls.svelte";

const mockFn = jest.fn();
let result: RenderResult;

beforeEach(() => {
	mockFn.mockReset();
});

describe("new game", () => {
	beforeEach(() => {
		result = render(Controls, { progress: EProgress.NewGame });
	});

	it("can deal", () => {
		result.component.$on("deal", mockFn);
		const deal = result.getByText("Deal");
		userEvent.click(deal);
		expect(mockFn).toHaveBeenCalled();
	});
	
	it("can't hit", () => {
		result.component.$on("hit", mockFn);
		const hit = result.getByText("Hit");
		userEvent.click(hit);
		expect(mockFn).not.toHaveBeenCalled();
	});

	it("can't stand", () => {
		result.component.$on("stand", mockFn);
		const stand = result.getByText("Stand");
		userEvent.click(stand);
		expect(mockFn).not.toHaveBeenCalled();
	});
});

describe("blackjack dealt", () => {
	beforeEach(() => {
		result = render(Controls, { progress: EProgress.BlackjackDealt });
	});

	it("can deal", () => {
		result.component.$on("deal", mockFn);
		const deal = result.getByText("Deal");
		userEvent.click(deal);
		expect(mockFn).toHaveBeenCalled();
	});
	
	it("can't hit", () => {
		result.component.$on("hit", mockFn);
		const hit = result.getByText("Hit");
		userEvent.click(hit);
		expect(mockFn).not.toHaveBeenCalled();
	});

	it("can't stand", () => {
		result.component.$on("stand", mockFn);
		const stand = result.getByText("Stand");
		userEvent.click(stand);
		expect(mockFn).not.toHaveBeenCalled();
	});
});

describe("player turn", () => {
	beforeEach(() => {
		result = render(Controls, { progress: EProgress.PlayerTurn });
	});

	it("can't deal", () => {
		result.component.$on("deal", mockFn);
		const deal = result.getByText("Deal");
		userEvent.click(deal);
		expect(mockFn).not.toHaveBeenCalled();
	});
	
	it("can hit", () => {
		result.component.$on("hit", mockFn);
		const hit = result.getByText("Hit");
		userEvent.click(hit);
		expect(mockFn).toHaveBeenCalled();
	});

	it("can stand", () => {
		result.component.$on("stand", mockFn);
		const stand = result.getByText("Stand");
		userEvent.click(stand);
		expect(mockFn).toHaveBeenCalled();
	});
});

describe("dealer turn", () => {
	beforeEach(() => {
		result = render(Controls, { progress: EProgress.DealerTurn });
	});

	it("can't deal", () => {
		result.component.$on("deal", mockFn);
		const deal = result.getByText("Deal");
		userEvent.click(deal);
		expect(mockFn).not.toHaveBeenCalled();
	});
	
	it("can't hit", () => {
		result.component.$on("hit", mockFn);
		const hit = result.getByText("Hit");
		userEvent.click(hit);
		expect(mockFn).not.toHaveBeenCalled();
	});

	it("can't stand", () => {
		result.component.$on("stand", mockFn);
		const stand = result.getByText("Stand");
		userEvent.click(stand);
		expect(mockFn).not.toHaveBeenCalled();
	});
});
