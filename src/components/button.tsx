import { JSX } from "solid-js/jsx-runtime";

type ButtonProps = {} & JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button(props: ButtonProps) {
	return (
		<button
			{...props}
			class={`disabled:bg-stone-600 disabled:hover:bg-stone-600 hover:bg-stone-700 active:transform disabled:translate-y-0 active:translate-y-px px-2 py-1 font-serif text-lg font-bold text-stone-50 disabled:text-stone-300 rounded bg-stone-600 ${props.class}`}
		>
			{props.children}
		</button>
	);
}
