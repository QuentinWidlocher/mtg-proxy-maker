type TypeBarProps = {
	type: string;
};

export default function TypeBar({ type }: TypeBarProps) {
	return (
		<div
			style={{
				display: "flex",
				"align-items": "center",
				top: "49.6mm",
				left: "4.7mm",
				right: "4.6mm",
				height: "5mm",
				position: "absolute",
			}}
		>
			<h1
				style={{
					margin: 0,
					"margin-left": "0.5mm",
					"font-family": "Beleren",
					"font-size": "8.5pt",
					flex: 1,
				}}
			>
				{type}
			</h1>
		</div>
	);
}
