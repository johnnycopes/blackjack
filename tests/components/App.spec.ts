import { render } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import fetchMock from "jest-fetch-mock";
import type { IDeckData } from "../../src/models/api/deck-data.interface";
import type { IDrawData } from "../../src/models/api/draw-data.interface";
import { createFakeCardData } from "../../src/functions/debugging";
import { wait } from "../../src/functions/utility";
import App from "../../src/components/App.svelte";

const mockDeckData: IDeckData = {
	deck_id: "77cikknyaadb",
	remaining: 312,
	shuffled: true,
	success: true,
};

const mockDrawData: IDrawData = {
	success: true,
	deck_id: "77cikknyaadb",
	cards: [
		createFakeCardData("AS"),
		createFakeCardData("5D"),
		createFakeCardData("0D"),
		createFakeCardData("5S"),
	],
	remaining: 308
};

describe("play game", () => {
	beforeEach(() => {
		fetchMock.resetMocks();
	});

	it("clicks the deal button", async () => {
		fetchMock.mockResponseOnce(JSON.stringify(mockDeckData));
		const result = render(App);
		const increaseBet = result.getByText("+");
		await userEvent.click(increaseBet);
		const dealButton = result.getByText("Deal");
		await wait(0);
		fetchMock.mockResponseOnce(JSON.stringify(mockDrawData));
		await userEvent.click(dealButton);
		await wait(0);
		// TODO: play out the rest of this game and others
		// console.log(prettyDOM(result.container));
	});
});
