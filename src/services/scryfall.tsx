import { match } from "ts-pattern";
import { parseCardColor, parseCardFrame } from "../types/backgrounds";
import { Card } from "../types/card";
import { CardError } from "../types/error";
import { ManaType, isBiType } from "../types/mana";

export function parseMana(manaCostString: string = ""): ManaType[] {
	const manaCost = manaCostString.match(/\{(.+?)\}/g) ?? [];
	return manaCost.flatMap((manaWithBraces): ManaType | ManaType[] => {
		const mana = manaWithBraces.replace("{", "").replace("}", "");
		return manaLetterToType(mana);
	});
}

export function manaLetterToType(manaLetter: string): ManaType | ManaType[] {
	switch (manaLetter) {
		case "W":
			return "white";
		case "U":
			return "blue";
		case "B":
			return "black";
		case "R":
			return "red";
		case "G":
			return "green";
		case "X":
			return "x";
		case "R/G":
		case "G/R":
			return "red-green";
		case "R/U":
		case "U/R":
			return "red-blue";
		case "R/B":
		case "B/R":
			return "red-black";
		case "R/W":
		case "W/R":
			return "red-white";
		case "G/U":
		case "U/G":
			return "green-blue";
		case "G/B":
		case "B/G":
			return "green-black";
		case "G/W":
		case "W/G":
			return "green-white";
		case "U/B":
		case "B/U":
			return "blue-black";
		case "U/W":
		case "W/U":
			return "blue-white";
		case "B/W":
		case "W/B":
			return "black-white";
		default:
			return [...new Array(parseInt(manaLetter) || 0)].map(
				() => "colorless" as const
			);
	}
}

export async function fetchCard(
	title: string,
	lang = "en",
	variant?: number
): Promise<Card> {
	const sanitizedTitle = title.split(" ").join("-");

	const [frCards, enCards]: [any, any] = await Promise.all([
		fetch(
			`https://api.scryfall.com/cards/search/?q=((!${sanitizedTitle}+lang:${lang})+or+(${sanitizedTitle}+t:token))+order:released`
		).catch((e) => {
			console.error(e);
			throw new CardError(
				title,
				(
					<>
						<span>Card with name</span>
						<span class="text-xl italic text-white">{title}</span>
						<span>not found for lang {lang}</span>
					</>
				)
			);
		}),
		fetch(
			`https://api.scryfall.com/cards/search/?q=((!${sanitizedTitle})+or+(${sanitizedTitle}+t:token))+order:released`
		).catch((e) => {
			console.error(e);
			throw new CardError(
				title,
				(
					<>
						<span>Card with name</span>
						<span class="text-xl italic text-white">{title}</span>
						<span>not found</span>
					</>
				)
			);
		}),
	]).then(([fr, en]) => Promise.all([fr.json(), en.json()]));

	if (enCards.status == 404) {
		throw new CardError(
			title,
			(
				<>
					<span>Card with name</span>
					<span class="text-xl italic text-white">{title}</span>
					<span>not found</span>
				</>
			)
		);
	}

	if (frCards.status == 404) {
		throw new CardError(
			title,
			(
				<>
					<span>Card with name</span>
					<span class="text-xl italic text-white">{title}</span>
					<span>not found for this language ({lang})</span>
				</>
			)
		);
	}

	const index = enCards.data.findIndex((c: any) => c.name == title);
	const [fr, en] = [frCards.data[index], enCards.data[index]];

	if ("card_faces" in fr) {
		throw new CardError(
			`Card ${title} is a split card`,
			(
				<>
					<span class="text-xl italic text-white">{title}</span>
					<span>Split cards are not supported (yet)</span>
				</>
			)
		);
	}

	const isBasicLand = en["type_line"].includes("Basic Land");
	const colorsToUse: string[] = en["type_line"].toLowerCase().includes("land")
		? fr["color_identity"]
		: fr["colors"];
	const manaTypes = colorsToUse.flatMap(manaLetterToType);
	const manaCost = parseMana(fr["mana_cost"]);

	const card: Card = {
		title: fr["printed_name"] || fr["name"],
		manaCost,
		artUrl: en["image_uris"]?.["art_crop"],
		aspect: {
			frame: parseCardFrame(en["type_line"]),
			color: parseCardColor(
				manaTypes,
				en["type_line"].toLowerCase().includes("artifact") &&
					!en["type_line"].toLowerCase().includes("vehicle"),
				manaCost
					.filter((type) => type != "colorless" && type != "x")
					.every(isBiType)
			),
			legendary:
				en["frame_effects"]?.includes("legendary") ||
				en["type_line"].toLowerCase().includes("legendary"),
		},
		typeText: fr["printed_type_line"] || en["type_line"],
		oracleText: fr["printed_text"] || fr["oracle_text"],
		flavorText: fr["flavor_text"],
		power: fr["power"],
		toughness: fr["toughness"],
		artist: fr["artist"],
		collectorNumber: fr["collector_number"],
		lang: fr["lang"],
		rarity: fr["rarity"],
		set: fr["set"],
		category: en["type_line"].toLowerCase().includes("planeswalker")
			? "Planeswalker"
			: "Regular",
		loyalty: en["loyalty"],
	};

	if (isBasicLand && variant) {
		const variants = await fetchVariants(en["name"]);
		return {
			...card,
			...variants[variant % variants.length],
		} as Card;
	} else {
		return card;
	}
}

export async function fetchVariants(title: string): Promise<Partial<Card>[]> {
	const sanitizedTitle = title.split(" ").join("-");

	const response = await fetch(
		`https://api.scryfall.com/cards/search/?q=!${sanitizedTitle}+unique:prints`
	).then((r) => r.json() as any);

	return response.data
		.map(
			(card: any): Partial<Card> => ({
				artUrl: card["image_uris"]?.["art_crop"],
				artist: card["artist"],
				collectorNumber: card["collector_number"],
				set: card["set"],
				rarity: card["rarity"],
				flavorText: card["flavor_text"],
			})
		)
		.filter(Boolean);
}

export async function searchCard(search: string) {
	if (search.length < 3) return [];

	const response = await fetch(
		`https://api.scryfall.com/cards/search/?q=${search}`
	).then(async (r) => {
		const json = (await r.json()) as any;
		if ("status" in json) {
			throw new Error(
				match(json.status)
					.with(404, () => "No cards found")
					.otherwise(() => "An error occured")
			);
		} else {
			return json;
		}
	});

	const result: Array<{
		name: string;
		type_line: string;
	}> = response.data;

	const deduped = result.filter(
		(card, index) => result.findIndex((c) => c.name == card.name) == index
	);

	return deduped;
}
