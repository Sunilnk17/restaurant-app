import { GetRestaurantsQuery, ParsedGetRestaurantsQuery } from "@models/get-restaurants-query"
import { PersonCuisines } from "@models/person-cuisines"
import { YelpApi, YelpConfig } from "@repositories/yelp-api"

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

		const cuisines = this.getCuisines(input)

		if(cuisines!==undefined) {
			const restaurantPromise = cuisines.map((cuisine) => {
				filters.categories = cuisine.toLocaleLowerCase().trim()
				return this.yelpRepository.fetchRestaurants(filters)
			})

			const restaurants = await Promise.all([...restaurantPromise])
			return restaurants
		}

		return this.yelpRepository.fetchRestaurants(filters)

	}


	// get the list of cuisines that most people are interested with.
	private getCuisines(input: PersonCuisines) : string[]{
		const cuisines: string[] = []

		const mapOfCuisinesFrequency: Map<string,number> = new Map<string, number>()

		input.persons.forEach((personCuisines) => {
			cuisines.push(...personCuisines.cuisines)
		})

		cuisines.forEach((cuisine) => {
			if(mapOfCuisinesFrequency.get(cuisine)) {
				mapOfCuisinesFrequency.set(cuisine, mapOfCuisinesFrequency.get(cuisine) + 1)
			}else {
				mapOfCuisinesFrequency.set(cuisine, 1)
			}
		})

		const sortedMap = new Map([...mapOfCuisinesFrequency.entries()].sort((a,b) => b[1] - a[1]))

		return Array.from(sortedMap.keys())
	}
}
