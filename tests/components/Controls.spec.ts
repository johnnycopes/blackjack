import { fireEvent, render } from "@testing-library/svelte";
import Controls from "../../src/components/Controls.svelte";

describe("playing", () => {
	test("deal", async () => {
		const result = render(Controls, { props: { playing: true } });
		const deal = result.getByText("Deal");
		const mock = jest.fn();
		// console.log("playing, is disabled?", `-${deal.getAttribute("disabled")}-`);
		await fireEvent.click(deal, mock);
		expect(mock).toHaveBeenCalled(); // ultimately, should fire 0 times
	});
});

describe("not playing", () => {
	test("deal", async () => {
		const result = render(Controls, { props: { playing: false } });
		const deal = result.getByText("Deal");
		const mock = jest.fn();
		// console.log("not playing, is disabled?", `-${deal.getAttribute("disabled")}-`);
		await fireEvent.click(deal, mock);
		expect(mock).toHaveBeenCalled(); // ultimately, should fire 1 time
	});
});
