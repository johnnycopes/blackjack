import { prettyDOM, render, RenderResult, screen} from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import Table from "../../src/components/Table.svelte";
import { EProgress } from "../../src/models/enums/progress.enum";
import { createFakeHand } from "../../src/functions/debugging";
import { getControls, getOutcome } from "../queries";

let result: RenderResult;

beforeEach(() => {
	result = render(Table, {
		playerHand: createFakeHand(),
		dealerHand: createFakeHand(),
		progress: EProgress.NewGame
	});
	const increaseBtn = result.getByText("+");
	userEvent.click(increaseBtn);
});

describe("before starting", () => {
	it("renders table", () => {
		expect(result.getByText("$10 (current bet)"));
		expect(result.getByText("$100 (total money)"));
		expect(getControls(result));
	});

	it("hides controls when no bet is placed", async () => {
		const decreaseBtn = result.getByText("-");
		await userEvent.click(decreaseBtn);
		expect(() => getControls(result)).toThrow();
	});
});

describe("gameplay", () => {
	it("shows outcome when player, dealer, or both are dealt 21", async () => {
		await result.component.$set({
			playerHand: createFakeHand("AD", "KC"),
			dealerHand: createFakeHand("5C", "5H"),
			progress: EProgress.BlackjackDealt
		})
		expect(getOutcome(result)).not.toBeEmptyDOMElement();
	});

	it("doesn't show outcome when it's player's turn", async () => {
		await result.component.$set({
			playerHand: createFakeHand("0D", "KC"),
			dealerHand: createFakeHand("5C", "5H"),
			progress: EProgress.PlayerTurn
		});
		expect(getOutcome(result)).toBeEmptyDOMElement();
	});

	it("doesn't show outcome when it's dealer's turn", async () => {
		await result.component.$set({
			playerHand: createFakeHand("0D", "KC"),
			dealerHand: createFakeHand("5C", "5H"),
			progress: EProgress.DealerTurn
		});
		expect(getOutcome(result)).toBeEmptyDOMElement();
	});

	it("shows outcome when player busts", async () => {
		await result.component.$set({
			playerHand: createFakeHand("0D", "KC", "2C"),
			dealerHand: createFakeHand("5C", "5H"),
			progress: EProgress.GameOver
		});
		expect(getOutcome(result)).not.toBeEmptyDOMElement();
	});

	it("shows outcome when dealer's turn is over", async () => {
		await result.component.$set({
			playerHand: createFakeHand("0D", "KC"),
			dealerHand: createFakeHand("JC", "7H"),
			progress: EProgress.GameOver
		});
		expect(getOutcome(result)).not.toBeEmptyDOMElement();

		await result.component.$set({
			playerHand: createFakeHand("0D", "8C"),
			dealerHand: createFakeHand("JC", "9H"),
			progress: EProgress.GameOver
		});
		expect(getOutcome(result)).not.toBeEmptyDOMElement();
	});
});