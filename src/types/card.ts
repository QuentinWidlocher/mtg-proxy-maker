import { CardColor, CardFrame } from "./backgrounds";
import { ManaType } from "./mana";

export type Card = {
	artUrl: string;
	flavorText: string;
	manaCost: ManaType[];
	oracleText: string;
	power?: string;
	title: string;
	toughness?: string;
	typeText: string;
	aspect: {
		frame: CardFrame;
		color: CardColor;
		legendary: boolean;
	};
	collectorNumber?: string;
	set?: string;
	rarity?: string;
	artist?: string;
	lang?: string;
} & (
	| {
			category: "Regular";
	  }
	| {
			category: "Planeswalker";
			loyalty: string;
	  }
);
