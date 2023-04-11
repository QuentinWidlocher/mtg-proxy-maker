import { JSX } from "solid-js/jsx-runtime";

export class JSXError extends Error {
	constructor(message: string, public messageElement: JSX.Element) {
		super(message);
		this.name = this.constructor.name;
	}
}

export class CardError extends JSXError {
	constructor(message: string, public messageElement: JSX.Element) {
		super(message, messageElement);
		this.name = this.constructor.name;
	}
}
