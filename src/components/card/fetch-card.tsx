import { Suspense, createMemo, createResource } from "solid-js";
import { fetchCard } from "../../services/scryfall";
import { ListCard } from "../../types/list-card";
import CardComponent from "./card";
import CardErrorComponent from "./card-error";
import CardLoading from "./card-loading";

export default function FetchCard(
  props: ListCard & { onVariantChange?: (variant: number) => void }
) {
  const fetcher = createMemo(() =>
    fetchCard(props.name, props.language, props.variant)
  );

  const [card] = createResource(
    () => [props.name, props.language, props.variant] as const,
    async ([cardName, language, variant]) => {
      const card = await fetcher()
        .then((card) => (
          <CardComponent
            card={card}
            variant={variant}
            onArtChange={(mod) => {
              const nextVariant = ((variant ?? 0) + mod) % card.totalVariants;
              props.onVariantChange?.(nextVariant);
            }}
          />
        ))
        .catch((e) => <CardErrorComponent cardName={cardName} error={e} />);

      return card;
    }
  );

  return <Suspense fallback={<CardLoading />}>{card.latest}</Suspense>;
}
