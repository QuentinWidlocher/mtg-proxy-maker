type StrengthProps = {
	power?: string;
	toughness?: string;
	textColor?: string;
};

export default function Strength({
	power = "",
	toughness = "",
	textColor = "black",
}: StrengthProps) {
	return (
		<div
			style={{
				display: "flex",
				"align-items": "center",
				"justify-content": "center",
				bottom: "5.2mm",
				right: "4.3mm",
				height: "4.2mm",
				width: "8.6mm",
				position: "absolute",
				"font-family": "Beleren",
				"font-size": "10pt",
				"z-index": 2,
				color: textColor,
			}}
		>
			<span
				style={{
					"margin-top": "0.5mm",
				}}
			>
				{power}
				{power && toughness && "/"}
				{toughness}
			</span>
		</div>
	);
}
