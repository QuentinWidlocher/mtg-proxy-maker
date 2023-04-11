import { JSX, Suspense, createResource } from "solid-js";
import { fetchCard } from "../../services/scryfall";
import CardComponent from "./card";
import CardErrorComponent from "./card-not-found";

export type FetchCardProps = {
	cardName: string;
	language: string;
	variant?: number;
};

const cache = new Map<string, JSX.Element>();

export default function FetchCard(props: FetchCardProps) {
	const key = `${props.cardName}-${props.language}-${props.variant}`;

	if (cache.has(key)) {
		return cache.get(key);
	}

	const [card] = createResource(
		() => [props.cardName, props.language, props.variant] as const,
		async ([cardName, language, variant]) => {
			if (cache.has(key)) {
				return cache.get(key);
			} else {
				const card = await fetchCard(cardName, language, variant)
					.then((card) => <CardComponent {...card} />)
					.catch((e) => <CardErrorComponent cardName={cardName} error={e} />);

				cache.set(key, card);

				return card;
			}
		}
	);

	return (
		<Suspense
			fallback={
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
			}
		>
			{card()}
		</Suspense>
	);
}
