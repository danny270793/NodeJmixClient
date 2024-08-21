import DotEnv from 'dotenv'
DotEnv.config()

import JmixClient from '..'
import LoginResponse from '../responses/login-response'

const protocol: string = process.env.JMIX_PROTOCOL || ''
const hostname: string = process.env.JMIX_HOSTNAME || ''
const port: number = parseInt(process.env.JMIX_PORT || '')
const username: string = process.env.JMIX_USERNAME || ''
const password: string = process.env.JMIX_PASSWORD || ''
const clientId: string = process.env.JMIX_CLIENT_ID || ''
const clientSecret: string = process.env.JMIX_CLIENT_SECRET || ''

describe('getAccessTokens function', () => {
    test.concurrent(
        'getAccessTokens must return access tokens from the rest client',
        async () => {
            const jmixClient: JmixClient = new JmixClient(
                protocol,
                hostname,
                port,
                username,
                password,
                clientId,
                clientSecret
            )
            const loginResponse: LoginResponse =
                await jmixClient.getAccessTokens()
            expect(loginResponse.accessToken).not.toBeUndefined()
        }
    )
    test.concurrent(
        'getAccessTokens must fail because credentials are invalid',
        async () => {
            const jmixClient: JmixClient = new JmixClient(
                protocol,
                hostname,
                port,
                'username',
                'password',
                clientId,
                clientSecret
            )
            try {
                await jmixClient.getAccessTokens()
                throw Error('getAccessTokens must not works successfully')
            } catch (error: any) {
                expect(error.response.data.error_description).toBe(
                    'Bad credentials'
                )
            }
        }
    )
})

/*
describe('revokeAccessTokens function', () => {
    test.concurrent(
        'revokeAccessTokens function must revoke token access successfully',
        async () => {
            const jmixClient: JmixClient = new JmixClient(
                protocol,
                hostname,
                port,
                username,
                password,
                clientId,
                clientSecret
            )

            await jmixClient.getEntities('User')
            await jmixClient.revokeAccessTokens()
            try {
                await jmixClient.getEntities('User')
                throw Error('getEntities must not works successfully')
            } catch (error: any) {
                console.log(error)
                expect(
                    error.response.data.error_description.startsWith(
                        'Invalid refresh token:'
                    )
                ).toBeTruthy()
            }
        }
    )
})
*/

/*
describe('refreshAccessTokens function', () => {
    test.concurrent(
        'refreshAccessTokens function must return a new access token',
        async () => {
            const jmixClient: JmixClient = new JmixClient(
                protocol,
                hostname,
                port,
                prefix,
                username,
                password,
                clientId,
                clientSecret
            )

            try {
                const accessToken: LoginResponse =
                    await jmixClient.getAccessTokens()
                const refreshAccessToken: LoginResponse =
                    await jmixClient.refreshAccessTokens()
                expect(accessToken.accessToken).not.toEqual(
                    refreshAccessToken.accessToken
                )
            } catch (error) {
                console.log(error)
                expect(error.response.status).toBe(200)
            }
        }
    )
})

describe('revokeRefreshTokens function', () => {
    test.concurrent(
        'revokeRefreshTokens function must revoke token refresh successfully',
        async () => {
            const jmixClient: JmixClient = new JmixClient(
                protocol,
                hostname,
                port,
                prefix,
                username,
                password,
                clientId,
                clientSecret
            )

            try {
                await jmixClient.getAccessTokens()
                await jmixClient.revokeRefreshTokens()
            } catch (error) {
                expect(error.response.status).toBe(200)
            }
        }
    )
})
*/
