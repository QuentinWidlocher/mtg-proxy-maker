import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import mtgParser from "mtg-parser";
import * as React from "react";
import { renderToString } from "react-dom/server";
import satori, { SatoriOptions } from "satori";
import promptUrl from "./assets/fonts/Prompt-ExtraLight.ttf";
import belerenUrl from "./assets/fonts/beleren-bold_P1.01.ttf";
import belerenSmallCapsUrl from "./assets/fonts/belerensmallcaps-bold.ttf";
import mplantinBoldUrl from "./assets/fonts/mplanti1.ttf";
import mplantinUrl from "./assets/fonts/mplantin.ttf";
import mplantinItalicUrl from "./assets/fonts/mplantinit.ttf";
import CardComponent from "./components/card";
import styles from "./main.css";
import { fetchCards } from "./services/scryfall";
import { GameSymbol, graphemeReplacement, symbols } from "./types/symbols";

global.React = React;

let mplantinFont = Buffer.from(mplantinUrl.split("base64,")[1], "base64");
let mplantinBoldFont = Buffer.from(
	mplantinBoldUrl.split("base64,")[1],
	"base64"
);
let mplantinItalicFont = Buffer.from(
	mplantinItalicUrl.split("base64,")[1],
	"base64"
);
let belerenFont = Buffer.from(belerenUrl.split("base64,")[1], "base64");
let belerenSmallCapsFont = Buffer.from(
	belerenSmallCapsUrl.split("base64,")[1],
	"base64"
);
let promptFont = Buffer.from(promptUrl.split("base64,")[1], "base64");

const satoriOptions: SatoriOptions = {
	width: 630,
	height: 880,
	embedFont: true,
	debug: false,
	graphemeImages: Object.entries(graphemeReplacement).reduce(
		(acc, [k, v]) => ({
			...acc,
			[v]: symbols[k as GameSymbol],
		}),
		{}
	),
	fonts: [
		{
			name: "MPlantin",
			data: mplantinFont,
			weight: 400,
			style: "normal",
		},
		{
			name: "MPlantin",
			data: mplantinBoldFont,
			weight: 700,
			style: "normal",
		},
		{
			name: "MPlantin",
			data: mplantinItalicFont,
			weight: 400,
			style: "italic",
		},
		{
			name: "Beleren",
			data: belerenFont,
			weight: 600,
			style: "normal",
		},
		{
			name: "Beleren Small Caps",
			data: belerenSmallCapsFont,
			weight: 600,
			style: "normal",
		},
		{
			name: "Prompt",
			data: promptFont,
			weight: 200,
			style: "normal",
		},
	],
};

const rawCardList = await readFile("cards.txt", "utf-8");

const { cards: parsedCardList } = mtgParser(rawCardList, "mtgo");

function isCardAlreadyRendered(cardName: string) {
	return existsSync(`out/${cardName}.json`);
}

const cards = (
	await Promise.all([
		...parsedCardList
			.filter((card) => !isCardAlreadyRendered(card.name))
			.flatMap((origCard) =>
				fetchCards(origCard.name, origCard.number)
					.then((cards) =>
						Promise.all(
							cards.flatMap(async (card) => ({
								...card,
								svg: await satori(await CardComponent(card), satoriOptions),
							}))
						)
					)
					.then((cards) =>
						Promise.all(
							cards.flatMap(async ({ svg, ...card }, i) => {
								console.log(`Rendered ${card.title} (${origCard.name})...`);
								await Promise.all([
									writeFile(`out/${origCard.name} (${i + 1}).svg`, svg),
									writeFile(`out/${origCard.name}.json`, JSON.stringify(card)),
								]);
								return { ...card, svg };
							})
						)
					)
					.catch((e) => console.error(e))
			),
		...parsedCardList
			.filter((card) => isCardAlreadyRendered(card.name))
			.flatMap((origCard) =>
				readFile(`out/${origCard.name}.json`, "utf-8")
					.then((card) => JSON.parse(card))
					.then((card: any) =>
						Promise.all(
							[...new Array(origCard.number)].map(async (_, i) => ({
								...card,
								svg: await readFile(
									`out/${origCard.name} (${i + 1}).svg`,
									"utf-8"
								),
							}))
						)
					)
					.catch((e) => console.error(e))
			),
	])
)
	.flat()
	.filter(Boolean);

const markup = renderToString(
	<>
		<html lang="en">
			<head>
				<meta charSet="UTF-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>{`${cards.length} cards to print`}</title>
				<style dangerouslySetInnerHTML={{ __html: styles }}></style>
			</head>
			<body>
				<main>
					{[...new Array(Math.ceil(cards.length / 9))].map((_, i) => (
						<div className="page">
							{cards.slice(i * 9, i * 9 + 9).map((card) => (
								<div
									className="card"
									dangerouslySetInnerHTML={{ __html: card!.svg }}
								/>
							))}
						</div>
					))}
				</main>
			</body>
		</html>
	</>
);

await writeFile("out/index.html", markup);
