import { GetRestaurantsQuery, ParsedGetRestaurantsQuery } from "@models/get-restaurants-query"
import { PersonCuisines } from "@models/person-cuisines"
import { YelpApi, YelpConfig } from "@repositories/yelp-api"
import { InvalidInputError } from "@root/errors/rest-errors/exceptions/invalid-input-error"

/**
 * Business logic layer for the Restaurant module.
 */
export class RestaurantService {
	private yelpRepository: YelpApi
	/**
	 * Creates a new instance of RestaurantService.
	 *
	 *
	 * @param YelpConfig The information needed to connect to the Yelp.
	 */
	constructor(yelpConfig: YelpConfig) {
		this.yelpRepository = new YelpApi(yelpConfig)
	}

	/**
	 * Retrieves a restaurants from the Yelp.
	 *
	 */
	public async fetchRestaurants(input: PersonCuisines, filters: ParsedGetRestaurantsQuery): Promise<any> {
		this.validateParams(filters)

		const cuisines = this.getCuisines(input)
		if (cuisines !== undefined) {
			const restaurantPromise = cuisines.map((cuisine) => {
				filters.categories = cuisine.toLocaleLowerCase().trim()
				return this.yelpRepository.fetchRestaurants(filters)
			})

			const restaurants = await Promise.all([...restaurantPromise])
			return restaurants
		}

		return this.yelpRepository.fetchRestaurants(filters)
	}

	private validateParams(filters: ParsedGetRestaurantsQuery) {
		if (filters.latitude !== undefined && filters.longitude !== undefined) {
			if (!this.coordinatesAreValid(filters.latitude, filters.longitude)) {
				throw new InvalidInputError("Invalid lat and lon values")
			}
		}

		if (filters.price !== undefined) {
			if (filters.price < 0 || filters.price > 4) {
				throw new InvalidInputError("Invalid price range.. It could be in the range between 1-4")
			}
		}

		if (filters.maxDistanceInMs !== undefined) {
			if (filters.maxDistanceInMs < 0 || filters.maxDistanceInMs > 4000) {
				throw new InvalidInputError("Invalid max distance range.. It could be in the range less than 4000. Tech limitations from yelp :/")
			}
		}
	}

	/**
	 *  Checks if the given coordinates represent a valid point in the world map.
	 *
	 *  @param lat The latitude of the coordinate
	 *  @param lon The longitude of the coordinate
	 */
	private coordinatesAreValid(lat: number, lon: number): boolean {
		const coordinatesAreUndefined = lat === undefined || lon === undefined
		const coordinatesAreInvalid = lat < -90 || lat > 90 || lon < -180 || lon > 180

		if (coordinatesAreUndefined || coordinatesAreInvalid) {
			return false
		}
		return true
	}

	// get the list of cuisines that most people are interested with.
	private getCuisines(input: PersonCuisines): string[] {
		const cuisines: string[] = []
		const mapOfCuisinesFrequency: Map<string, number> = new Map<string, number>()

		input.persons.forEach((personCuisines) => {
			cuisines.push(...personCuisines.cuisines)
		})

		cuisines.forEach((cuisine) => {
			if (mapOfCuisinesFrequency.get(cuisine)) {
				mapOfCuisinesFrequency.set(cuisine, mapOfCuisinesFrequency.get(cuisine) + 1)
			} else {
				mapOfCuisinesFrequency.set(cuisine, 1)
			}
		})

		const sortedMap = new Map([...mapOfCuisinesFrequency.entries()].sort((a, b) => b[1] - a[1]))

		return Array.from(sortedMap.keys())
	}
}
