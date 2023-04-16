import { JSX } from "solid-js/jsx-runtime";
import { Card } from "../../types/card";

type TypeBarProps = {
	type: string;
	category: Card["category"];
};

const style: Record<Card["category"], JSX.CSSProperties> = {
	Planeswalker: {
		top: "49.4mm",
		left: "4.7mm",
		right: "4.6mm",
		height: "4.3mm",
		position: "absolute",
	},
	Regular: {
		top: "49.6mm",
		left: "4.7mm",
		right: "4.6mm",
		height: "5mm",
	},
};

export default function TypeBar({ type, category }: TypeBarProps) {
	return (
		<div
			style={{
				display: "flex",
				"align-items": "center",
				position: "absolute",
				"z-index": 2,
				...style[category],
			}}
		>
			<h1
				style={{
					margin: 0,
					"margin-left": "0.5mm",
					"font-family": "Beleren",
					"font-size": type.split(" ").length > 4 ? "7pt" : "8.5pt",
					flex: 1,
				}}
			>
				{type}
			</h1>
		</div>
	);
}
