import { prettyDOM, render, RenderResult } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import fetchMock from "jest-fetch-mock";
import type { IDeckData } from "../../src/models/api/deck-data.interface";
import type { IDeck } from "../../src/models/interfaces/deck.interface";
import { createFakeDeck, createFakeDeckData, drawFromFakeDeck } from "../../src/functions/debugging";
import { wait } from "../../src/functions/utility";
import App from "../../src/components/App.svelte";

describe("plays game", () => {
	let mockDeckData: IDeckData;
	let mockDeck: IDeck;
	let result: RenderResult;
	let dealButton: HTMLElement;
	let hitButton: HTMLElement;

	beforeEach(async () => {
		mockDeckData = createFakeDeckData();
		mockDeck = createFakeDeck(mockDeckData);
		fetchMock.resetMocks();
		fetchMock.mockResponseOnce(JSON.stringify(mockDeckData));
		result = render(App);
		const increaseBet = result.getByText("+");
		await userEvent.click(increaseBet);
		dealButton = result.getByText("Deal");
		hitButton = result.getByText("Hit");
	});

	describe("player gets blackjack", () => {
		it("clicks the deal button and game ends", async () => {
			const mockDealData = drawFromFakeDeck(mockDeck, ["AS", "5D", "0D", "5S"]);
			fetchMock.mockResponseOnce(JSON.stringify(mockDealData));
			await userEvent.click(dealButton);
			await wait();
			expect(result.getByTestId("outcome")).toHaveTextContent("Blackjack!");
		});
	});

	describe("dealer gets blackjack", () => {
		it("clicks the deal button and game ends", async () => {
			const mockDealData = drawFromFakeDeck(mockDeck, ["5D", "AS", "5S", "0D"]);
			fetchMock.mockResponseOnce(JSON.stringify(mockDealData));
			await userEvent.click(dealButton);
			await wait();
			expect(result.getByTestId("outcome")).toHaveTextContent("Dealer wins");
		});
	});

	describe("typical game", () => {
		beforeEach(async () => {
			const mockDealData = drawFromFakeDeck(mockDeck, ["KS", "0S", "6D", "0D"]);
			fetchMock.mockResponseOnce(JSON.stringify(mockDealData));
			await userEvent.click(dealButton);
			await wait();
		});

		describe("player busts", () => {
			it("clicks the deal button", async () => {
				expect(result.getByTestId("outcome")).toBeEmptyDOMElement();
			});
	
			it("clicks the hit button and game ends", async () => {
				const mockHitData = drawFromFakeDeck(mockDeck, ["QC"]);
				fetchMock.mockResponseOnce(JSON.stringify(mockHitData));
				await userEvent.click(hitButton);
				await wait();
				expect(result.getByTestId("outcome")).toHaveTextContent("Dealer wins");
			});
		});
	});
});
