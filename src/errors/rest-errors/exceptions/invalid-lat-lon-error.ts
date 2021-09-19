import { MainError } from "@models/errors/rest/main-error"
import { RestError } from "@root/rest/rest-error"
import { RestErrorType } from "@root/rest/rest-error-type"

/**
 * Thrown when a wrong latitude and/or longitude are provided as input for a request.
 */
export class InvalidLatLonError extends MainError {
	constructor() {
		super("The latitude and longitude values provided are not valid.")
	}

	public toRestError(): RestError {
		return new RestError(
			RestErrorType.InvalidLatLon,
			"The latitude and longitude values provided are not valid.",
			"The latitude and longitude values provided are not valid.",
			400
		)
	}
}
