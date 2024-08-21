import BaseResponse from '../responses/base-response'

export default interface User extends BaseResponse {
    username: string
    active: boolean
    firstName: string|undefined
    lastName: string|undefined
    timeZoneId: string|undefined
    email: string|undefined
}
