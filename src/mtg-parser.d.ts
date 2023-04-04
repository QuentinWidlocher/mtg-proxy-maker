declare module "mtg-parser" {
	type Card = {
		number: number;
		name: string;
	};

	export default function (
		deckString: string,
		format: "mtgo" | "mws" | "mtgs"
	): {
		name: string;
		format: string;
		cards: Card[];
		sideboard: Card[];
	};
}
