import { CardError } from "../../types/error";

export default function CardErrorComponent(props: {
	cardName: string;
	error?: Error;
}) {
	console.debug("error", props.error);
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
				{props.error && props.error instanceof CardError ? (
					props.error.messageElement
				) : (
					<>
						<span>Error while creating</span>
						<span class="text-xl italic text-white">{props.cardName}</span>
					</>
				)}
			</div>
		</div>
	);
}
