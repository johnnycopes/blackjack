import { render } from "@testing-library/svelte";
import userEvent from '@testing-library/user-event'
import Controls from "../../src/components/Controls.svelte";

const mockDeal = jest.fn();

beforeEach(() => {
	mockDeal.mockReset();
});

describe("playing", () => {
	test("deal", () => {
		const result = render(Controls, { playing: true });
		result.component.$on("deal", mockDeal);
		const deal = result.getByText("Deal");
		userEvent.click(deal);
		expect(mockDeal).not.toHaveBeenCalled();
	});
});

describe("not playing", () => {
	test("deal", () => {
		const result = render(Controls, { playing: false });
		result.component.$on("deal", mockDeal);
		const deal = result.getByText("Deal");
		userEvent.click(deal);
		expect(mockDeal).toHaveBeenCalled();
	});
});
