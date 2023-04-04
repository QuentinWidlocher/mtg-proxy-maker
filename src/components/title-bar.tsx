import { ManaType, manaTypeToSvg, manaTypes } from "../types/mana";
import { symbols } from "../types/symbols";

type TitleBarProps = {
	title: string;
	manaCost?: ManaType[];
};

function Mana({ src }: { src: string }) {
	return (
		<img
			style={{
				width: 32,
				height: 32,
				marginLeft: 2,
				marginTop: "auto",
				marginBottom: "auto",
				borderRadius: "100%",
				boxShadow: "-2px 3px 0px black",
			}}
			src={src}
		/>
	);
}

const fontSizeByLength = {
	25: 28,
	24: 29,
	23: 30,
	22: 31,
	0: 32,
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
				justifyContent: "space-around",
				width: "100%",
				top: 45,
				height: 40,
				paddingLeft: 50,
				paddingRight: 50,
				position: "absolute",
				fontFamily: "Beleren",
				whiteSpace: "nowrap",
			}}
		>
			<h1
				style={{
					margin: 0,
					marginTop: "auto",
					marginBottom: "auto",
					fontSize: Object.entries(fontSizeByLength)
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
						alignItems: "center",
					}}
				>
					{colorlessMana.length > 0 && colorlessMana.length in symbols && (
						<Mana src={symbols[colorlessMana.length as keyof typeof symbols]} />
					)}
					{coloredMana.map((mana) => (
						<Mana src={manaTypeToSvg[mana]} />
					))}
				</div>
			)}
		</div>
	);
}
