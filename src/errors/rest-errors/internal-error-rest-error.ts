import { RestError } from "@root/rest/rest-error"

export class InternalErrorRestError extends RestError {
	constructor() {
		super(
			"Internal Error",
			"An unexpected internal server error happened.",
			"An unexpected internal server error happened.",
			500
		)
	}
}
