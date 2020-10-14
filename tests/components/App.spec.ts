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
	let standButton: HTMLElement;

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
		standButton = result.getByText("Stand");
	});

	describe("blackjack(s) dealt", () => {
		it("shows outcome when player gets blackjack", async () => {
			const mockDealData = drawFromFakeDeck(mockDeck, ["AS", "5D", "0D", "5S"]);
			fetchMock.mockResponseOnce(JSON.stringify(mockDealData));
			await userEvent.click(dealButton);
			await wait();
			expect(result.getByTestId("outcome")).toHaveTextContent("Blackjack!");
		});

		it("shows outcome when dealer gets blackjack", async () => {
			const mockDealData = drawFromFakeDeck(mockDeck, ["5D", "AS", "5S", "0D"]);
			fetchMock.mockResponseOnce(JSON.stringify(mockDealData));
			await userEvent.click(dealButton);
			await wait();
			expect(result.getByTestId("outcome")).toHaveTextContent("Dealer wins");
		});

		it("shows outcome when both player and dealer get blackjack", async () => {
			const mockDealData = drawFromFakeDeck(mockDeck, ["AC", "AS", "QS", "0D"]);
			fetchMock.mockResponseOnce(JSON.stringify(mockDealData));
			await userEvent.click(dealButton);
			await wait();
			expect(result.getByTestId("outcome")).toHaveTextContent("Push");
		});
	});

	describe("no blackjack(s) dealt", () => {
		describe("player has 16; dealer has 20", () => {
			beforeEach(async () => {
				const mockDealData = drawFromFakeDeck(mockDeck, ["KS", "0S", "6D", "0D"]);
				fetchMock.mockResponseOnce(JSON.stringify(mockDealData));
				await userEvent.click(dealButton);
				await wait();
			});
	
			it("doesn't show outcome on deal", async () => {
				expect(result.getByTestId("outcome")).toBeEmptyDOMElement();
			});
	
			it("shows outcome when player busts", async () => {
				const mockHitData = drawFromFakeDeck(mockDeck, ["QC"]);
				fetchMock.mockResponseOnce(JSON.stringify(mockHitData));
				await userEvent.click(hitButton);
				await wait();
				expect(result.getByTestId("outcome")).toHaveTextContent("Dealer wins");
			});
	
			it("shows outcome when player wins", async () => {
				const mockHitData = drawFromFakeDeck(mockDeck, ["5C"]);
				fetchMock.mockResponseOnce(JSON.stringify(mockHitData));
				await userEvent.click(hitButton);
				await userEvent.click(standButton);
				await wait(1000);
				expect(result.getByTestId("outcome")).toHaveTextContent("Player wins");
			});

			it("shows outcome when dealer wins", async () => {
				const mockHitData = drawFromFakeDeck(mockDeck, ["3C"]);
				fetchMock.mockResponseOnce(JSON.stringify(mockHitData));
				await userEvent.click(hitButton);
				await userEvent.click(standButton);
				await wait(1000);
				expect(result.getByTestId("outcome")).toHaveTextContent("Dealer wins");
			});
		});

		describe("player has 20; dealer has 16", () => {
			beforeEach(async () => {
				const mockDealData = drawFromFakeDeck(mockDeck, ["0S", "KD", "JC", "6H"]);
				fetchMock.mockResponseOnce(JSON.stringify(mockDealData));
				await userEvent.click(dealButton);
				await wait();
			});

			it("doesn't show outcome on deal", async () => {
				expect(result.getByTestId("outcome")).toBeEmptyDOMElement();
			});

			it("shows outcome when dealer busts", async () => {
				const mockStayData = drawFromFakeDeck(mockDeck, ["QC"]);
				fetchMock.mockResponseOnce(JSON.stringify(mockStayData));
				await userEvent.click(standButton);
				await wait(3000);
				expect(result.getByTestId("outcome")).toHaveTextContent("Player wins");
			});

			it("shows outcome when player wins", async () => {
				const mockStayData = drawFromFakeDeck(mockDeck, ["3C"]);
				fetchMock.mockResponseOnce(JSON.stringify(mockStayData));
				await userEvent.click(standButton);
				await wait(3000);
				expect(result.getByTestId("outcome")).toHaveTextContent("Player wins");
			});

			it("shows outcome when dealer wins", async () => {
				const mockStayData = drawFromFakeDeck(mockDeck, ["5C"]);
				fetchMock.mockResponseOnce(JSON.stringify(mockStayData));
				await userEvent.click(standButton);
				await wait(3000);
				expect(result.getByTestId("outcome")).toHaveTextContent("Dealer wins");
			});
		});
	});
});
