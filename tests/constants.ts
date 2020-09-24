import type { ICardData } from "../src/models/api/card-data.interface";
import type { IMoney } from "../src/models/interfaces/money.interface";

export const NUMBER_CARD_3_RESPONSE_DATA: ICardData = {
  code: "3H",
  image: "https://deckofcardsapi.com/static/img/3H.png",
  images: {
    svg: "https://deckofcardsapi.com/static/img/3H.svg",
    png: "https://deckofcardsapi.com/static/img/3H.png",
  },
  value: "3",
  suit: "HEARTS",
};

export const NUMBER_CARD_8_RESPONSE_DATA: ICardData = {
  code: "8C",
  image: "https://deckofcardsapi.com/static/img/8C.png",
  images: {
    svg: "https://deckofcardsapi.com/static/img/8C.svg",
    png: "https://deckofcardsapi.com/static/img/8C.png",
  },
  value: "8",
  suit: "CLUBS",
};

export const FACE_CARD_RESPONSE_DATA: ICardData = {
	code: "KD",
	image: "https://deckofcardsapi.com/static/img/KD.png",
	images: {
		svg: "https://deckofcardsapi.com/static/img/KD.svg",
		png: "https://deckofcardsapi.com/static/img/KD.png"
	},
	value: "KING",
	suit: "DIAMONDS"
};

export const ACE_CARD_RESPONSE_DATA: ICardData = {
	code: "AS",
	image: "https://deckofcardsapi.com/static/img/AS.png",
	images: {
		svg: "https://deckofcardsapi.com/static/img/AS.svg",
		png: "https://deckofcardsapi.com/static/img/AS.png"
	},
	value: "ACE",
	suit: "SPADES"
};

export const MONEY: IMoney = {
	bet: 100,
	total: 1000
};