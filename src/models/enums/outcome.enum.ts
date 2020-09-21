// TODO: refactor this to be enum of keys only and refactor outcome to be string

export enum EOutcome {
	Blackjack = "Blackjack!",
	PlayerWins = "Player wins",
	DealerWins = "Dealer wins",
	PlayerBusts = "Dealer wins!",
	DealerBusts = "Player wins!",
	Push = "Push"
};