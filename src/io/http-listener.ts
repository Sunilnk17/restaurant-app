import { MainError } from "@models/errors/rest/main-error"
import { InternalErrorRestError } from "@root/errors/rest-errors/internal-error-rest-error"
import { RestError } from "@root/rest/rest-error"
import { RestSuccess } from "@root/rest/rest-success"
import fastify, { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify"

export type HttpCallback = (request: FastifyRequest) => Promise<HttpCallbackResponse>
export type HttpCallbackResponse = {
	error?: RestError
	success?: RestSuccess
}

/**
 * A wrapper that makes it easy to listen to events from HTTP
 */
export class HttpListener {
	// Http Server that receives the event grid events
	private app = fastify()

	/**
	 * Creates an HttpListener which creates an HTTP server for HTTP events.
	 *
	 *
	 * @param port The port of the http server that will be started
	 */
	constructor(private port: number) {}

	/**
	 * Starts the HTTP server to listen for incoming HTTP requests.
	 *
	 */
	public listen(): void {
		this.app.listen(this.port, "0.0.0.0", (error, address) => {
			if (error) {
				console.warn(error)
				return
			}
			console.log("[HttpListener]", "Listening on", address)
		})
	}

	/**
	 * Closes the HTTP server.
	 *
	 */
	public close(): void {
		this.app.close()
	}

	/**
	 * This function will call the HTTP callback and returns the response. If an error happens this will be replaced by
	 * a generic error to not leak sensitive data.
	 *
	 *
	 * @param request The incoming request, used to pass to the http callback for additional data.
	 * @param httpCallback The http callback that will be called to handle the request.
	 *
	 * @return A promise resolving with the response of the http callback.
	 */
	private async onRequest(request: FastifyRequest, reply: FastifyReply, httpCallback: HttpCallback) {
		try {
			const result = (await httpCallback.call(null, request)) as HttpCallbackResponse

			if (result.error !== undefined) {
				reply.statusCode = result.error.status
				return result.error
			} else if (result.success !== undefined) {
				reply.statusCode = result.success.statusCode === undefined ? 200 : result.success.statusCode
				return result.success.result
			} else {
				throw new Error("No result.")
			}
		} catch (error) {
			console.warn(error)

			let restError: RestError = new InternalErrorRestError()
			if (error instanceof MainError) {
				restError = error.toRestError()
			}

			reply.statusCode = restError.status
			return restError
		}
	}

	/**
	 * Registers a post-request route on the server, when called it will execute the http callback.
	 * A post request can have a body.
	 *
	 *
	 * @param route The route of the post-request.
	 * @param httpCallback The callback that will be executed.
	 */
	public onPost(route: string, httpCallback: HttpCallback): void {
		this.app.post(route, async (request: FastifyRequest, reply: FastifyReply) => {
			return await this.onRequest(request, reply, httpCallback)
		})
	}
}
