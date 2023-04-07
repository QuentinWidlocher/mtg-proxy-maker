import { ManaType, manaTypeToSvg, manaTypes } from "../../types/mana";
import { symbols } from "../../types/symbols";

type TitleBarProps = {
	title: string;
	manaCost?: ManaType[];
};

function Mana({ src }: { src: string }) {
	return (
		<img
			style={{
				width: "3mm",
				height: "3mm",
				"margin-left": "0.3mm",
				"margin-bottom": "0.8mm",
				"border-radius": "100%",
				"box-shadow": "-0.5px 1px 0px black",
			}}
			src={src}
		/>
	);
}

const fontSizeByLength = {
	28: "8.9pt",
	26: "9.2pt",
	25: "9.5pt",
	0: "10pt",
} as const;

export default function TitleBar({ title, manaCost = [] }: TitleBarProps) {
	const sortedMana = manaCost.sort(
		(a, b) =>
			manaTypes.findIndex((t) => t === a) - manaTypes.findIndex((t) => t === b)
	);

	const colorlessMana = sortedMana.filter((mana) => mana == "colorless");
	const coloredMana = sortedMana.filter((mana) => mana != "colorless");

	return (
		<div
			style={{
				display: "flex",
				"justify-content": "space-around",
				top: "4.5mm",
				height: "4.9mm",
				left: "4.7mm",
				right: "4.6mm",
				position: "absolute",
				"font-family": "Beleren",
				"white-space": "nowrap",
			}}
		>
			<h1
				style={{
					margin: 0,
					"margin-top": "auto",
					"margin-bottom": "auto",
					"margin-left": "0.5mm",
					"font-size": Object.entries(fontSizeByLength)
						.sort(([a], [b]) => parseInt(b) - parseInt(a))
						.find(([length, _]) => title.length >= parseInt(length))?.[1],
					flex: 1,
				}}
			>
				{title}
			</h1>
			{manaCost.length > 0 && (
				<div
					style={{
						display: "flex",
						"align-items": "center",
					}}
				>
					{colorlessMana.length > 0 && colorlessMana.length in symbols && (
						<Mana src={symbols[colorlessMana.length as keyof typeof symbols]} />
					)}
					{coloredMana.map((mana, i) => (
						<Mana src={manaTypeToSvg[mana]} />
					))}
				</div>
			)}
		</div>
	);
}
