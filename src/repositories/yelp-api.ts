import { GetRestaurantsQuery, ParsedGetRestaurantsQuery } from "@models/get-restaurants-query"
import axios, { AxiosError, AxiosInstance } from "axios"

export type YelpConfig = {
	endpoint: string
	code: string
}

export class YelpApi {
	private yelpConfig: YelpConfig

	private yelpInstance: AxiosInstance

	constructor(yelpConfig: YelpConfig) {
		this.yelpConfig = yelpConfig

		this.initYelpInstance()
	}

	// Initialize the yelp api instance
	private initYelpInstance(): void {
		this.yelpInstance = axios.create({
			baseURL: this.yelpConfig.endpoint,
			timeout: 10000, // 10 seconds
			headers: {
				"Authorization": `Bearer ${this.yelpConfig.code}`
			}
		})
	}

	/**
	 * Makes an API request to fetch restaurants from Yelp
	 */
	public async fetchRestaurants(filters: ParsedGetRestaurantsQuery): Promise<any> {
		try {
			const restaurants = await this.yelpInstance.get<any>(`/businesses/search`, {
				params: this.getQueryParams(filters)
			})

			return restaurants.data
		} catch (error: any) {
			console.error("[YelpApi]", error)
			// If it is an axios error it is an http error
			if (error.isAxiosError) {
				const axiosError = error as AxiosError
				const response = axiosError.response

				const data = response.data
				console.error("[YelpApi]", data)
			}

			// If something went wrong, propogate the error
			throw error
		}
	}

	getQueryParams(filters: ParsedGetRestaurantsQuery): object {
		return {
			location: filters.location,
			latitude: filters.latitude,
			longitude: filters.longitude,
			price: filters.price,
			radius: filters.maxDistanceInMs,
			categories: filters.categories
		}
	}
}
