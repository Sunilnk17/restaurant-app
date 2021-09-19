import "module-alias/register"

import { YELP_ENDPOINT, YELP_API_KEY } from "@config/dotenv"
import { HttpListener } from "@io/http-listener"
import { RestaurantController } from "@controllers/restaurant-controller"
import { YelpConfig } from "@repositories/yelp-api"

// Container port
const PORT = 3000

// Create an HTTP listener
const httpListener = new HttpListener(PORT)

const yelpConfig: YelpConfig = {
	endpoint: YELP_ENDPOINT,
	code: YELP_API_KEY
}

// create restaurant controller
const restaurantController = new RestaurantController(httpListener, yelpConfig)

// Bind the events
restaurantController.bind()

// Listen to it (non-blocking)
httpListener.listen()

console.log("[Server]", "Listeners started.")
