import { RestError } from "@root/rest/rest-error"

export abstract class MainError extends Error {
	constructor(message: string) {
		super(message)
	}

	public abstract toRestError(): RestError
}
