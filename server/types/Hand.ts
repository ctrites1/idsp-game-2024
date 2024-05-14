import { Card } from "./Card";

export type Hand = {
	id: number;
	card_1: Card;
	card_2: Card;
	card_3: Card;
	card_4: Card;
	card_5: Card;
	card_6: Card;
	card_7: Card;
	player_id: number;
	round_id: number;
};
