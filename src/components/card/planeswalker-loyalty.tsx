type PlaneswalkerLoyaltyProps = {
	value?: string;
};

export default function PlaneswalkerLoyalty({
	value = "",
}: PlaneswalkerLoyaltyProps) {
	return (
		<div
			class="text-white"
			style={{
				display: "flex",
				"align-items": "center",
				"justify-content": "center",
				bottom: "5.1mm",
				right: "4.3mm",
				height: "4.2mm",
				width: "7mm",
				position: "absolute",
				"font-family": "Beleren",
				"font-size": "9.5pt",
				"z-index": 2,
			}}
		>
			<span
				style={{
					"margin-top": "0.7mm",
				}}
			>
				{value}
			</span>
		</div>
	);
}
