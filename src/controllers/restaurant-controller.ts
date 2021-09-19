import "module-alias/register"
import { HttpListener } from "@io/http-listener"

import { YelpConfig } from "@repositories/yelp-api"
import { SuccessResponse } from "@root/rest/success-response"
import { RestaurantService } from "@services/restaurant-service"
import GetRestaurantQuerySchema from "../schemas/get-restaurant-query.json"
import PersonCuisinesSchema from "../schemas/person-cuisines.json"

import { Controller } from "./controller"
import { GetRestaurantsQuery, ParsedGetRestaurantsQuery } from "@models/get-restaurants-query"
import { PersonCuisines } from "@models/person-cuisines"

/**
 * Controller for the Restaurant module.
 */
export class RestaurantController extends Controller {
	// RestaurantService we will connect to
	private restaurantService: RestaurantService

	/**
	 * Constructs a new RestaurantController.
	 * @param httpListener  The HttpListener, used to listen for HTTP events.
	 */
	constructor(httpListener: HttpListener, yelpConfig: YelpConfig) {
		super(httpListener)

		this.restaurantService = new RestaurantService(yelpConfig)
	}

	/**
	 * Binds the restaurant controller
	 */
	public bind(): void {
		this.bindHttp()
	}

	private bindHttp() {
		// GET
		this.bindHttpGetRestaurants()
	}

	// Retrieves all restaurants
	private bindHttpGetRestaurants(): void {
		this.httpListener.onPost("/restaurants", async (request) => {
			return await this.validateRequestBody(
				request,
				async (input: PersonCuisines, params: GetRestaurantsQuery) => {
					const parsed = ParsedGetRestaurantsQuery.createFrom(params)
					const restaurants = await this.restaurantService.fetchRestaurants(input, parsed)
					return new SuccessResponse(restaurants)
				},
				PersonCuisinesSchema,
				GetRestaurantQuerySchema
			)
		})
	}
}
