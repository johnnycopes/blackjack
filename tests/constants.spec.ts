import type { ICardData } from "../src/models/api/card-data.interface";

export const NUMBER_CARD_RESPONSE_DATA: ICardData = {
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