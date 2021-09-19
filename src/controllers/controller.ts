import { Validator, Schema, ValidationError } from "jsonschema"
import { FastifyRequest } from "fastify"

import { HttpListener } from "../io/http-listener"
import { SuccessResponse } from "@root/rest/success-response"
import { ErrorResponse } from "@root/rest/error-response"
import { InvalidInputError } from "@root/errors/rest-errors/exceptions/invalid-input-error"

/**
 * An interface for micro-service controllers.
 */
 export abstract class Controller {
	protected validator = new Validator()

	/**
	 * @param httpListener The listener of incoming HTTP requests. Used to subscribe to HTTP requests.
	 */
	constructor(
		protected httpListener: HttpListener
	) {}

	/**
	 * Connects the controller to the HttpListener.
	 */
	public abstract bind(): void

	/**
	 * Wrapper function for handling HTTP requests that validates the HTTP body with a json schema.
	 */

	private async validateRequestInternal<T, U>(
		request: FastifyRequest,
		handler: (body?: T, params?: U) => Promise<SuccessResponse | ErrorResponse>,
		bodySchema?: Schema,
		paramsSchema?: Schema
	): Promise<SuccessResponse | ErrorResponse> {
		// Check the validity of the request body
		let isValid: boolean = true
		let messages: string []

		if (bodySchema !== undefined) {
			isValid = this.validator.validate(request.body, bodySchema).valid
		}
		if (paramsSchema !== undefined) {
			const result = this.validator.validate(request.query, paramsSchema)
			isValid = isValid && this.validator.validate(request.query, paramsSchema).valid
			 messages = result.errors.map((error) => {
				return error.message
			})
		}

		// If it is valid, return the output of the success callback
		if (isValid) {
			return await handler.call(this, request.body as T, request.query as U)
		}
		// Else return the error for invalid input.
		else {
			return new InvalidInputError(undefined,messages).toRestError().toErrorResponse()
		}
	}

	/**
	 * Validates a FastifyRequest body with a json scheme and optionally validates query params.
	 *
	 * This function will validate the HTTP body of the HTTP request against the JSON schema.
	 * If the validation was successful, the function will call the success callback.
	 * If the validation was unsuccessful, the function will return a 400 Bad Request saying the input was invalid.
	 *
	 * @param request The incoming HTTP request.
	 * @param handler The callback to call when the validation succeeded.
	 * @param bodySchema The JSON schema that the body of the request should conform to.
	 * @param paramsSchema The JSON schema that the query params should conform to.
	 *
	 * @returns A promise returning the reply for the HTTP request.
	 */
	protected validateRequestBody<T, U>(
		request: FastifyRequest,
		handler: (body: T, params?: U) => Promise<SuccessResponse | ErrorResponse>,
		bodySchema: Schema,
		paramsSchema?: Schema
	): Promise<SuccessResponse | ErrorResponse> {
		return this.validateRequestInternal(
			request,
			(body?: T, params?: U) => {
				return handler.call(this, body!, params)
			},
			bodySchema,
			paramsSchema
		)
	}
}
