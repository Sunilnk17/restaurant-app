import { MainError } from "@models/errors/rest/main-error"
import { RestError } from "@root/rest/rest-error"
import { RestErrorType } from "@root/rest/rest-error-type"

class InvalidInputRestError extends RestError {
	constructor(public details?: string, public messages?: string[]) {
		super(
			RestErrorType.InvalidInput,
			"The input of the request is invalid.",
			undefined,
			400
		)
	}
}

/**
 * Thrown when an attempting to create an object with an invalid input.
 */
export class InvalidInputError extends MainError {
	constructor(public details?: string, public messages?: string[]) {
		super(details)
	}

	public toRestError(): RestError {
		return new InvalidInputRestError(this.details, this.messages)
	}
}
