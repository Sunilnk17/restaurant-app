import * as dotenv from "dotenv"

dotenv.config()
let path
switch (process.env.NODE_ENV) {
	case "test":
		path = `${__dirname}/../../.env.test`
		break
	case "production":
		path = `${__dirname}/../../.env.production`
		break
	default:
		path = `${__dirname}/../../.env.development`
}
dotenv.config({ path })

export const YELP_ENDPOINT = process.env.YELP_ENDPOINT
export const YELP_API_KEY = process.env.YELP_API_KEY
