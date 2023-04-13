export default function CardLoading() {
	return (
		<div
			class="flex shadow-xl print:hidden rounded-xl bg-stone-500 animate-pulse"
			style={{
				position: "relative",
				"font-family": "MPlantin",
				"font-size": "12pt",
				height: " auto",
				width: "var(--card-width)",
				"min-width": "var(--card-width)",
				"max-width": "var(--card-width)",
				"aspect-ratio": "63/88",
				margin: "auto",
				"box-sizing": "content-box",
			}}
		></div>
	);
}
