import { render, RenderResult } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import fetchMock from "jest-fetch-mock";
import type { IDeckData } from "../../src/models/api/deck-data.interface";
import type { IDeck } from "../../src/models/interfaces/deck.interface";
import type { CardCode } from "../../src/models/types/card-code.type";
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

	async function dealCards(deck: IDeck, player: CardCode[], dealer: CardCode[]) {
		const mockDealData = drawFromFakeDeck(deck, [player[0], dealer[0], player[1], dealer[1]]);
		fetchMock.mockResponseOnce(JSON.stringify(mockDealData));
		await userEvent.click(dealButton);
		await wait();
	}

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
		it("player gets blackjack", async () => {
			await dealCards(mockDeck, ["AS", "0D"], ["5D", "5S"]);
			expect(result.getByTestId("outcome")).toHaveTextContent("Blackjack!");
		});

		it("dealer gets blackjack", async () => {
			await dealCards(mockDeck, ["5D", "5S"], ["AS", "0D"]);
			expect(result.getByTestId("outcome")).toHaveTextContent("Dealer wins");
		});

		it("both player and dealer get blackjack", async () => {
			await dealCards(mockDeck, ["AC", "QS"], ["AS", "0D"]);
			expect(result.getByTestId("outcome")).toHaveTextContent("Push");
		});
	});

	describe("no blackjack(s) dealt", () => {
		it("player hits -> player busts", async () => {
			await dealCards(mockDeck, ["KS", "6D"], ["0S", "JD"]);
			expect(result.getByTestId("outcome")).toBeEmptyDOMElement();
			const mockHitData = drawFromFakeDeck(mockDeck, ["QC"]);
			fetchMock.mockResponseOnce(JSON.stringify(mockHitData));
			await userEvent.click(hitButton);
			await wait();
			expect(result.getByTestId("outcome")).toHaveTextContent("Dealer wins");
		});

		it("player hits -> player stands -> player wins", async () => {
			await dealCards(mockDeck, ["KS", "6D"], ["0S", "JD"]);
			expect(result.getByTestId("outcome")).toBeEmptyDOMElement();
			const mockHitData = drawFromFakeDeck(mockDeck, ["5C"]);
			fetchMock.mockResponseOnce(JSON.stringify(mockHitData));
			await userEvent.click(hitButton);
			await userEvent.click(standButton);
			await wait(1000);
			expect(result.getByTestId("outcome")).toHaveTextContent("Player wins");
		});

		it("player hits -> player stands -> dealer wins", async () => {
			await dealCards(mockDeck, ["KS", "6D"], ["0S", "JD"]);
			expect(result.getByTestId("outcome")).toBeEmptyDOMElement();
			const mockHitData = drawFromFakeDeck(mockDeck, ["3C"]);
			fetchMock.mockResponseOnce(JSON.stringify(mockHitData));
			await userEvent.click(hitButton);
			await userEvent.click(standButton);
			await wait(1000);
			expect(result.getByTestId("outcome")).toHaveTextContent("Dealer wins");
		});

		it("player hits -> player stands -> push", async () => {
			await dealCards(mockDeck, ["KS", "7D"], ["0S", "JD"]);
			expect(result.getByTestId("outcome")).toBeEmptyDOMElement();
			const mockHitData = drawFromFakeDeck(mockDeck, ["3C"]);
			fetchMock.mockResponseOnce(JSON.stringify(mockHitData));
			await userEvent.click(hitButton);
			await userEvent.click(standButton);
			await wait(1000);
			expect(result.getByTestId("outcome")).toHaveTextContent("Push");
		});

		it("player stands -> dealer stands -> player wins", async () => {
			await dealCards(mockDeck, ["0S", "JD"], ["KS", "7D"]);
			expect(result.getByTestId("outcome")).toBeEmptyDOMElement();
			await userEvent.click(standButton);
			await wait(1000);
			expect(result.getByTestId("outcome")).toHaveTextContent("Player wins");
		});

		it("player stands -> dealer stands -> dealer wins", async () => {
			await dealCards(mockDeck, ["KS", "6D"], ["0S", "JD"]);
			expect(result.getByTestId("outcome")).toBeEmptyDOMElement();
			await userEvent.click(standButton);
			await wait(1000);
			expect(result.getByTestId("outcome")).toHaveTextContent("Dealer wins");
		});

		it("player stands -> dealer stands -> push", async () => {
			await dealCards(mockDeck, ["KS", "0D"], ["0S", "JD"]);
			expect(result.getByTestId("outcome")).toBeEmptyDOMElement();
			await userEvent.click(standButton);
			await wait(1000);
			expect(result.getByTestId("outcome")).toHaveTextContent("Push");
		});

		it("player stands -> dealer hits -> dealer busts", async () => {
			await dealCards(mockDeck, ["0S", "JD"], ["KS", "6D"]);
			expect(result.getByTestId("outcome")).toBeEmptyDOMElement();
			const mockStandData = drawFromFakeDeck(mockDeck, ["QC"]);
			fetchMock.mockResponseOnce(JSON.stringify(mockStandData));
			await userEvent.click(standButton);
			await wait(3000);
			expect(result.getByTestId("outcome")).toHaveTextContent("Player wins");
		});

		it("player stands -> dealer hits -> dealer stands -> player wins", async () => {
			await dealCards(mockDeck, ["0S", "JD"], ["KS", "6D"]);
			expect(result.getByTestId("outcome")).toBeEmptyDOMElement();
			const mockStandData = drawFromFakeDeck(mockDeck, ["3C"]);
			fetchMock.mockResponseOnce(JSON.stringify(mockStandData));
			await userEvent.click(standButton);
			await wait(3000);
			expect(result.getByTestId("outcome")).toHaveTextContent("Player wins");
		});

		it("player stands -> dealer hits -> dealer stands -> dealer wins", async () => {
			await dealCards(mockDeck, ["0S", "JD"], ["KS", "6D"]);
			expect(result.getByTestId("outcome")).toBeEmptyDOMElement();
			const mockStandData = drawFromFakeDeck(mockDeck, ["5C"]);
			fetchMock.mockResponseOnce(JSON.stringify(mockStandData));
			await userEvent.click(standButton);
			await wait(3000);
			expect(result.getByTestId("outcome")).toHaveTextContent("Dealer wins");
		});

		it("player stands -> dealer hits -> dealer stands -> push", async () => {
			await dealCards(mockDeck, ["0S", "JD"], ["KS", "6D"]);
			expect(result.getByTestId("outcome")).toBeEmptyDOMElement();
			const mockStandData = drawFromFakeDeck(mockDeck, ["4C"]);
			fetchMock.mockResponseOnce(JSON.stringify(mockStandData));
			await userEvent.click(standButton);
			await wait(3000);
			expect(result.getByTestId("outcome")).toHaveTextContent("Push");
		});
	});
});
