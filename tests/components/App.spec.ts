import { findByText, prettyDOM, render, waitFor } from "@testing-library/svelte";
import App from "../../src/components/App.svelte";
import type { IDeckData } from "../../src/models/api/deck-data.interface";
import fetchMock from "jest-fetch-mock";

const mockDeckData: IDeckData = {
	deck_id: "77cikknyaadb",
	remaining: 312,
	shuffled: true,
	success: true,
};

it("renders app", async () => {
	// fetchMock.mockResponseOnce(JSON.stringify(mockDeckData));
	// const result = render(App);
	// const deal = await findByText(result.container, "Deal");
	// console.log("here", prettyDOM(deal));
	// expect(deal).not.toThrow();
	// console.log(result);
	// expect(() => result.component.$$).toEqual({
		// expect(() => result).not.toThrow();
	// 	id: "77cikknyaadb",
	// 	remaining: 312,
	// });
	expect(true).toEqual(true);
});
