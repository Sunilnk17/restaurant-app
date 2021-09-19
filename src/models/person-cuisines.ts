/**
 * The allowed filters on the incoming request, everything is a string because query params are part of the url.
 */

export interface PersonCuisines {
	persons: Cuisines[]
}
export interface Cuisines {
	cuisines: string[]
}
