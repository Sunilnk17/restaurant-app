/**
 * The allowed filters on the incoming request, everything is a string because query params are part of the url.
 */
export interface GetRestaurantsQuery {
	location?: string
	price?: string
	latitude?: string
	longitude?: string
	maxDistanceInMs?: string
	category?: string
}

/**
 * The parsed version of {@link GetRestaurantsQuery}, all non-strings are correctly parsed.
 */
export class ParsedGetRestaurantsQuery {
	location?: string
	price?: number
	latitude?: number
	longitude?: number
	maxDistanceInMs?: number
	categories?: string

	/**
	 * Creates a parsed version of {@link GetRestaurantsQuery}.
	 *
	 * @param data The incoming query parameters for the get-restaurant request.
	 * @returns The parsed version of these query parmaters.
	 */
	static createFrom(data: GetRestaurantsQuery): ParsedGetRestaurantsQuery {
		const parsed = new ParsedGetRestaurantsQuery()

		parsed.location = data.location
		parsed.latitude = data.latitude !== undefined ? Number(data.latitude) : undefined
		parsed.longitude = data.longitude !== undefined ? Number(data.longitude) : undefined
		parsed.price = data.price !== undefined ? Number(data.price) : undefined
		parsed.maxDistanceInMs = data.maxDistanceInMs !== undefined ? Number(data.maxDistanceInMs) : undefined
		parsed.categories = data.category

		return parsed
	}
}
