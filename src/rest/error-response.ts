import { RestError } from "./rest-error"

export class ErrorResponse {
	constructor(public error: RestError) {}
}
