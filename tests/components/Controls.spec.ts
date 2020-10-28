import { render, RenderResult } from "@testing-library/svelte";
import { EProgress } from "../../src/models/enums/progress.enum";
import Controls from "../../src/components/Controls.svelte";
import { click } from "../testing";

const mockFn = jest.fn();
let result: RenderResult;

beforeEach(() => {
	mockFn.mockReset();
});

describe("new game", () => {
	beforeEach(() => {
		result = render(Controls, { progress: EProgress.NewGame });
	});

	it("can deal", async () => {
		result.component.$on("deal", mockFn);
		const deal = result.getByRole("button", { name: "Deal" });
		await click(deal);
		expect(mockFn).toHaveBeenCalled();
	});
	
	it("can't hit", async () => {
		result.component.$on("hit", mockFn);
		const hit = result.getByRole("button", { name: "Hit" });
		await click(hit);
		expect(mockFn).not.toHaveBeenCalled();
	});

	it("can't stand", async () => {
		result.component.$on("stand", mockFn);
		const stand = result.getByRole("button", { name: "Stand" });
		await click(stand);
		expect(mockFn).not.toHaveBeenCalled();
	});
});

describe("blackjack dealt", () => {
	beforeEach(() => {
		result = render(Controls, { progress: EProgress.BlackjackDealt });
	});

	it("can deal", async () => {
		result.component.$on("deal", mockFn);
		const deal = result.getByRole("button", { name: "Deal" });
		await click(deal);
		expect(mockFn).toHaveBeenCalled();
	});
	
	it("can't hit", async () => {
		result.component.$on("hit", mockFn);
		const hit = result.getByRole("button", { name: "Hit" });
		await click(hit);
		expect(mockFn).not.toHaveBeenCalled();
	});

	it("can't stand", async () => {
		result.component.$on("stand", mockFn);
		const stand = result.getByRole("button", { name: "Stand" });
		await click(stand);
		expect(mockFn).not.toHaveBeenCalled();
	});
});

describe("player turn", () => {
	beforeEach(() => {
		result = render(Controls, { progress: EProgress.PlayerTurn });
	});

	it("can't deal", async () => {
		result.component.$on("deal", mockFn);
		const deal = result.getByRole("button", { name: "Deal" });
		await click(deal);
		expect(mockFn).not.toHaveBeenCalled();
	});
	
	it("can hit", async () => {
		result.component.$on("hit", mockFn);
		const hit = result.getByRole("button", { name: "Hit" });
		await click(hit);
		expect(mockFn).toHaveBeenCalled();
	});

	it("can stand", async () => {
		result.component.$on("stand", mockFn);
		const stand = result.getByRole("button", { name: "Stand" });
		await click(stand);
		expect(mockFn).toHaveBeenCalled();
	});
});

describe("dealer turn", () => {
	beforeEach(() => {
		result = render(Controls, { progress: EProgress.DealerTurn });
	});

	it("can't deal", async () => {
		result.component.$on("deal", mockFn);
		const deal = result.getByRole("button", { name: "Deal" });
		await click(deal);
		expect(mockFn).not.toHaveBeenCalled();
	});
	
	it("can't hit", async () => {
		result.component.$on("hit", mockFn);
		const hit = result.getByRole("button", { name: "Hit" });
		await click(hit);
		expect(mockFn).not.toHaveBeenCalled();
	});

	it("can't stand", async () => {
		result.component.$on("stand", mockFn);
		const stand = result.getByRole("button", { name: "Stand" });
		await click(stand);
		expect(mockFn).not.toHaveBeenCalled();
	});
});
