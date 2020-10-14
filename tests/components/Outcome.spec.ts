import { render } from "@testing-library/svelte";
import { EOutcome } from "../../src/models/enums/outcome.enum";
import Outcome from "../../src/components/Outcome.svelte";

describe("renders message depending on outcome", () => {
	it("no outcome", () => {
		const result = render(Outcome, { outcome: undefined });
		expect(result.getByTestId("outcome")).toBeEmptyDOMElement();
	});
	
	it("player gets blackjack", () => {
		const result = render(Outcome, { outcome: EOutcome.PlayerBlackjack });
		expect(result.getByTestId("outcome")).toHaveTextContent("Blackjack!");
	});
	
	it("player wins", () => {
		const result = render(Outcome, { outcome: EOutcome.PlayerWins });
		expect(result.getByTestId("outcome")).toHaveTextContent("Player wins");
	});
	
	it("player busts", () => {
		const result = render(Outcome, { outcome: EOutcome.PlayerBusts });
		expect(result.getByTestId("outcome")).toHaveTextContent("Dealer wins");
	});
	
	it("dealer gets blackjack", () => {
		const result = render(Outcome, { outcome: EOutcome.DealerBlackjack });
		expect(result.getByTestId("outcome")).toHaveTextContent("Dealer wins");
	});
	
	it("dealer wins", () => {
		const result = render(Outcome, { outcome: EOutcome.DealerWins });
		expect(result.getByTestId("outcome")).toHaveTextContent("Dealer wins");
	});
	
	it("dealer busts", () => {
		const result = render(Outcome, { outcome: EOutcome.DealerBusts });
		expect(result.getByTestId("outcome")).toHaveTextContent("Player wins");
	});
	
	it("both dealer and player get blackjack or the same score", () => {
		const result = render(Outcome, { outcome: EOutcome.Push });
		expect(result.getByTestId("outcome")).toHaveTextContent("Push");
	});
});
