import { render, RenderResult } from "@testing-library/svelte";
import fetchMock from "jest-fetch-mock";
import type { IDeckData } from "../../src/models/api/deck-data.interface";
import type { IDeck } from "../../src/models/interfaces/deck.interface";
import type { CardCode } from "../../src/models/types/card-code.type";
import { appConfig } from "../../src/config/app-config";
import { createFakeDeck, createFakeDeckData, drawFromFakeDeck } from "../../src/functions/debugging";
import { click } from "../testing";
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
		await click(dealButton);
	}

	beforeEach(async () => {
		mockDeckData = createFakeDeckData();
		mockDeck = createFakeDeck(mockDeckData);
		fetchMock.resetMocks();
		fetchMock.mockResponseOnce(JSON.stringify(mockDeckData));
		result = render(App, { mode: appConfig.mode });
		const chip = result.getByRole("button", { name: "$100 chip" });
		await click(chip);
		dealButton = result.getByRole("button", { name: "Deal" });
		hitButton = result.getByRole("button", { name: "Hit" });
		standButton = result.getByRole("button", { name: "Stand" });
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
			expect(() => result.getByTestId("outcome")).toThrow();
			const mockHitData = drawFromFakeDeck(mockDeck, ["QC"]);
			fetchMock.mockResponseOnce(JSON.stringify(mockHitData));
			await click(hitButton);
			expect(result.getByTestId("outcome")).toHaveTextContent("Dealer wins");
		});

		it("player hits -> player stands -> player wins", async () => {
			await dealCards(mockDeck, ["KS", "6D"], ["0S", "JD"]);
			expect(() => result.getByTestId("outcome")).toThrow();
			const mockHitData = drawFromFakeDeck(mockDeck, ["5C"]);
			fetchMock.mockResponseOnce(JSON.stringify(mockHitData));
			await click(hitButton);
			await click(standButton);
			expect(result.getByTestId("outcome")).toHaveTextContent("Player wins");
		});

		it("player hits -> player stands -> dealer wins", async () => {
			await dealCards(mockDeck, ["KS", "6D"], ["0S", "JD"]);
			expect(() => result.getByTestId("outcome")).toThrow();
			const mockHitData = drawFromFakeDeck(mockDeck, ["3C"]);
			fetchMock.mockResponseOnce(JSON.stringify(mockHitData));
			await click(hitButton);
			await click(standButton);
			expect(result.getByTestId("outcome")).toHaveTextContent("Dealer wins");
		});

		it("player hits -> player stands -> push", async () => {
			await dealCards(mockDeck, ["KS", "7D"], ["0S", "JD"]);
			expect(() => result.getByTestId("outcome")).toThrow();
			const mockHitData = drawFromFakeDeck(mockDeck, ["3C"]);
			fetchMock.mockResponseOnce(JSON.stringify(mockHitData));
			await click(hitButton);
			await click(standButton);
			expect(result.getByTestId("outcome")).toHaveTextContent("Push");
		});

		it("player stands -> dealer stands -> player wins", async () => {
			await dealCards(mockDeck, ["0S", "JD"], ["KS", "7D"]);
			expect(() => result.getByTestId("outcome")).toThrow();
			await click(standButton);
			expect(result.getByTestId("outcome")).toHaveTextContent("Player wins");
		});

		it("player stands -> dealer stands -> dealer wins", async () => {
			await dealCards(mockDeck, ["KS", "6D"], ["0S", "JD"]);
			expect(() => result.getByTestId("outcome")).toThrow();
			await click(standButton);
			expect(result.getByTestId("outcome")).toHaveTextContent("Dealer wins");
		});

		it("player stands -> dealer stands -> push", async () => {
			await dealCards(mockDeck, ["KS", "0D"], ["0S", "JD"]);
			expect(() => result.getByTestId("outcome")).toThrow();
			await click(standButton);
			expect(result.getByTestId("outcome")).toHaveTextContent("Push");
		});

		it("player stands -> dealer hits -> dealer busts", async () => {
			await dealCards(mockDeck, ["0S", "JD"], ["KS", "6D"]);
			expect(() => result.getByTestId("outcome")).toThrow();
			const mockStandData = drawFromFakeDeck(mockDeck, ["QC"]);
			fetchMock.mockResponseOnce(JSON.stringify(mockStandData));
			await click(standButton);
			expect(result.getByTestId("outcome")).toHaveTextContent("Player wins");
		});

		it("player stands -> dealer hits -> dealer stands -> player wins", async () => {
			await dealCards(mockDeck, ["0S", "JD"], ["KS", "6D"]);
			expect(() => result.getByTestId("outcome")).toThrow();
			const mockStandData = drawFromFakeDeck(mockDeck, ["3C"]);
			fetchMock.mockResponseOnce(JSON.stringify(mockStandData));
			await click(standButton);
			expect(result.getByTestId("outcome")).toHaveTextContent("Player wins");
		});

		it("player stands -> dealer hits -> dealer stands -> dealer wins", async () => {
			await dealCards(mockDeck, ["0S", "JD"], ["KS", "6D"]);
			expect(() => result.getByTestId("outcome")).toThrow();
			const mockStandData = drawFromFakeDeck(mockDeck, ["5C"]);
			fetchMock.mockResponseOnce(JSON.stringify(mockStandData));
			await click(standButton);
			expect(result.getByTestId("outcome")).toHaveTextContent("Dealer wins");
		});

		it("player stands -> dealer hits -> dealer stands -> push", async () => {
			await dealCards(mockDeck, ["0S", "JD"], ["KS", "6D"]);
			expect(() => result.getByTestId("outcome")).toThrow();
			const mockStandData = drawFromFakeDeck(mockDeck, ["4C"]);
			fetchMock.mockResponseOnce(JSON.stringify(mockStandData));
			await click(standButton);
			expect(result.getByTestId("outcome")).toHaveTextContent("Push");
		});
	});
});