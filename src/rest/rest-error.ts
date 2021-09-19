import { ErrorResponse } from "./error-response"

export class RestError {
	// A URL to a document describing the error condition, should resolve to a human-readable document).
	type: string

	// A short, human-readable title for the general error type; the title should not change for given types.
	title: string

	// A human-readable description of the specific error; the detail may be specific per error
	detail: string

	// The HTTP status-code
	status: number

	// This optional key may be present, with a unique URI for the specific error; this will often point to an error log for that specific response.
	instance?: string = undefined

	/**
	 * Creates an instance of the RestError class
	 *
	 *
	 * @param type A URL to a document describing the error condition, should resolve to a human-readable document).
	 * @param title A short, human-readable title for the general error type; the title should not change for given types.
	 * @param detail A human-readable description of the specific error; the detail may be specific per error
	 * @param status The HTTP status-code
	 * @param instance This optional key may be present, with a unique URI for the specific error; this will often point to an error log for that specific response.
	 */
	constructor(type: string, title: string, detail: string, status: number, instance?: string) {
		this.type = type
		this.title = title
		this.detail = detail
		this.status = status
		this.instance = instance
	}

	public toErrorResponse(): ErrorResponse {
		return new ErrorResponse(this)
	}
}
