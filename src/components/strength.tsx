type StrengthProps = {
	power?: string;
	toughness?: string;
};

export default function Strength({
	power = "",
	toughness = "",
}: StrengthProps) {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				bottom: 52,
				right: 47,
				height: 39,
				width: 80,
				position: "absolute",
				fontFamily: "Beleren",
				fontSize: 32,
			}}
		>
			{power}
			{power && toughness && "/"}
			{toughness}
		</div>
	);
}
