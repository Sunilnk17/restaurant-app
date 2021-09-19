import { RestSuccess } from "./rest-success"

export class SuccessResponse {
	public readonly success: RestSuccess

	constructor(response: object = {}, code: number = 200) {
		this.success = new RestSuccess(response, code)
	}
}
