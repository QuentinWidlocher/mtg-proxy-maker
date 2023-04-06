import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { Card } from "./card";
import {
	BiManaType,
	ManaType,
	UnaryManaType,
	isUnaryType,
	unaryToBiType,
} from "./mana";

export const cardFrames = [
	"Vehicle",
	"Basic Land",
	"Creature",
	"Nonbasic Land",
	"Noncreature",
] as const;

export type CardFrame = typeof cardFrames[number];

export function parseCardFrame(engTypeText: string): CardFrame {
	const lowercaseType = engTypeText.toLowerCase();

	if (lowercaseType.includes("creature")) {
		return "Creature";
	} else if (lowercaseType.includes("basic land")) {
		return "Basic Land";
	} else if (lowercaseType.includes("land")) {
		return "Nonbasic Land";
	} else if (lowercaseType.includes("vehicle")) {
		return "Vehicle";
	} else if (
		lowercaseType.includes("instant") ||
		lowercaseType.includes("sorcery") ||
		lowercaseType.includes("enchantment") ||
		lowercaseType.includes("artifact")
	) {
		return "Noncreature";
	} else {
		throw new Error(`Unknown card type: ${engTypeText}`);
	}
}

export const cardColors = [
	"Black",
	"Blue",
	"Green",
	"Red",
	"White",
	"Colorless",
	"Artifact",
	"Gold-3+",
	"Gold-BG",
	"Gold-BR",
	"Gold-GU",
	"Gold-GW",
	"Gold-RG",
	"Gold-RW",
	"Gold-UB",
	"Gold-UR",
	"Gold-UW",
	"Gold-WB",
	"hybrid-BG",
	"hybrid-BR",
	"hybrid-GU",
	"hybrid-GW",
	"hybrid-RG",
	"hybrid-RW",
	"hybrid-UB",
	"hybrid-UR",
	"hybrid-UW",
	"hybrid-WB",
] as const;

export type CardColor = typeof cardColors[number];

export function parseCardColor(mana: ManaType[], artifact: boolean): CardColor {
	if (artifact) {
		return "Artifact";
	}

	const coloredMana = mana.filter((type) => type != "colorless" && type != "x");

	switch (coloredMana.length) {
		case 0:
			return "Colorless";
		case 1:
			if (isUnaryType(coloredMana[0])) {
				return unaryManaToColor(coloredMana[0]);
			} else {
				return biManaToColor(coloredMana[0], false);
			}
		case 2:
			if (isUnaryType(coloredMana[0]) && isUnaryType(coloredMana[1])) {
				const result = Object.entries(unaryToBiType).find(([multi, array]) => {
					return array.every((type) => coloredMana.includes(type));
				});

				if (result) {
					return biManaToColor(result[0] as BiManaType, true);
				} else {
					return "Gold-3+";
				}
			} else {
				return "Gold-3+";
			}
		default:
			return "Gold-3+";
	}
}

export function unaryManaToColor(mana: UnaryManaType): CardColor {
	switch (mana) {
		case "red":
			return "Red";
		case "green":
			return "Green";
		case "blue":
			return "Blue";
		case "black":
			return "Black";
		case "white":
			return "White";
		case "colorless":
			return "Colorless";
		default:
			throw new Error(`Unknown unary mana type: ${mana}`);
	}
}

export function biManaToColor(mana: BiManaType, gold: boolean): CardColor {
	switch (mana) {
		case "red-green":
			return gold ? "Gold-RG" : "hybrid-RG";
		case "red-blue":
			return gold ? "Gold-UR" : "hybrid-UR";
		case "red-black":
			return gold ? "Gold-BR" : "hybrid-BR";
		case "red-white":
			return gold ? "Gold-RW" : "hybrid-RW";
		case "green-blue":
			return gold ? "Gold-GU" : "hybrid-GU";
		case "green-black":
			return gold ? "Gold-BG" : "hybrid-BG";
		case "green-white":
			return gold ? "Gold-GW" : "hybrid-GW";
		case "blue-black":
			return gold ? "Gold-UB" : "hybrid-UB";
		case "blue-white":
			return gold ? "Gold-UW" : "hybrid-UW";
		case "black-white":
			return gold ? "Gold-WB" : "hybrid-WB";
		default:
			throw new Error(`Unknown unary mana type: ${mana}`);
	}
}

export async function getBackgroundFromAspect({
	color,
	frame,
	legendary,
}: Card["aspect"]): Promise<string> {
	const fileName = `Frame=${frame}, Color=${color}, Legendary=${
		legendary ? "Yes" : "No"
	}, Holo Stamp=Yes.svg`;

	if (!existsSync(`./src/assets/images/card-backgrounds/${fileName}`)) {
		throw new Error(`Background not found: ${fileName}`);
	}

	const buffer = await readFile(
		`./src/assets/images/card-backgrounds/${fileName}`
	);

	return `data:image/svg+xml;base64,${buffer.toString("base64")}`;
}
