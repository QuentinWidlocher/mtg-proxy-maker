export default function CardNotFoundComponent({
	cardName,
}: {
	cardName: string;
}) {
	return (
		<div
			class="flex shadow-xl print:hidden rounded-xl bg-stone-800"
			style={{
				position: "relative",
				"font-family": "MPlantin",
				"font-size": "12pt",
				height: " auto",
				width: "var(--card-width)",
				"min-width": "var(--card-width)",
				"max-width": "var(--card-width)",
				"aspect-ratio": "63/88",
				border: "var(--card-bleed) solid var(--card-bgc)",
				margin: "auto",
				"box-sizing": "content-box",
			}}
		>
			<div class="flex flex-col items-center gap-5 m-auto text-stone-300">
				<span>Card with name</span>
				<span class="text-xl italic text-white">{cardName}</span>
				<span>not found for this language</span>
			</div>
		</div>
	);
}
