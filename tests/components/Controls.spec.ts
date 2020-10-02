import { render } from "@testing-library/svelte";
import userEvent from '@testing-library/user-event'
import Controls from "../../src/components/Controls.svelte";

const mockFn = jest.fn();

beforeEach(() => {
	mockFn.mockReset();
});

describe("while playing", () => {
	test("can't deal", () => {
		const result = render(Controls, { playing: true });
		result.component.$on("deal", mockFn);
		const deal = result.getByText("Deal");
		userEvent.click(deal);
		expect(mockFn).not.toHaveBeenCalled();
	});
	
	test("can hit", () => {
		const result = render(Controls, { playing: true });
		result.component.$on("hit", mockFn);
		const hit = result.getByText("Hit");
		userEvent.click(hit);
		expect(mockFn).toHaveBeenCalled();
	});

	test("can stay", () => {
		const result = render(Controls, { playing: true });
		result.component.$on("stay", mockFn);
		const stay = result.getByText("Stay");
		userEvent.click(stay);
		expect(mockFn).toHaveBeenCalled();
	});
});

describe("not playing", () => {
	test("can deal", () => {
		const result = render(Controls, { playing: false });
		result.component.$on("deal", mockFn);
		const deal = result.getByText("Deal");
		userEvent.click(deal);
		expect(mockFn).toHaveBeenCalled();
	});

	test("can't hit", () => {
		const result = render(Controls, { playing: false });
		result.component.$on("hit", mockFn);
		const hit = result.getByText("Hit");
		userEvent.click(hit);
		expect(mockFn).not.toHaveBeenCalled();
	});

	test("can't stay", () => {
		const result = render(Controls, { playing: false });
		result.component.$on("stay", mockFn);
		const stay = result.getByText("Stay");
		userEvent.click(stay);
		expect(mockFn).not.toHaveBeenCalled();
	});
});
