import { JSX, Suspense, createResource } from "solid-js";
import { fetchCard } from "../../services/scryfall";
import CardComponent from "./card";
import CardLoading from "./card-loading";
import CardErrorComponent from "./card-error";

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

	return <Suspense fallback={<CardLoading />}>{card()}</Suspense>;
}
