export default interface LoginResponse {
    accessToken: string
    tokenType: string
    refreshToken: string
    expiresIn: number
    scope: string
}
