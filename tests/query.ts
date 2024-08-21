/*
import DotEnv from 'dotenv'
DotEnv.config()

import CubaClient from '..'
import User from '../entities/user'

const protocol: string = process.env.CUBA_PROTOCOL || ''
const hostname: string = process.env.CUBA_HOSTNAME || ''
const port: number = parseInt(process.env.CUBA_PORT || '')
const prefix: string = process.env.CUBA_PREFIX || ''
const username: string = process.env.CUBA_USERNAME || ''
const password: string = process.env.CUBA_PASSWORD || ''
const clientId: string = process.env.CUBA_CLIENT_ID || ''
const clientSecret: string = process.env.CUBA_CLIENT_SECRET || ''

describe('executeQuery function', () => {
    test.concurrent(
        'executeQuery function must returns the available queries',
        async () => {
            const cubaClient: CubaClient = new CubaClient(
                protocol,
                hostname,
                port,
                prefix,
                username,
                password,
                clientId,
                clientSecret
            )
            const queries: Query[] = await cubaClient.getQueries('sec$User')
            console.log(queries)
            expect(queries.length).toBeGreaterThanOrEqual(1)
        }
    )
    test.concurrent(
        'executeQuery function must return 1 record',
        async () => {
            const cubaClient: CubaClient = new CubaClient(
                protocol,
                hostname,
                port,
                prefix,
                username,
                password,
                clientId,
                clientSecret
            )
            const entitiesName: string = 'cubaserver_Person'

            const queryName: string = 'queryPersona2'
            try {
                const result = await cubaClient.executeQuery(
                    entitiesName,
                    queryName,
                    {},
                    undefined,
                    1
                )
                expect(result.length).toBeLessThanOrEqual(1)
            } catch (error) {
                expect(error.response.status).toBe(200)
            }
        }
    )
    test.concurrent(
        'executeQuery function must returns records named Marco',
        async () => {
            const cubaClient: CubaClient = new CubaClient(
                protocol,
                hostname,
                port,
                prefix,
                username,
                password,
                clientId,
                clientSecret
            )
            const entitiesName: string = 'cubaserver_Person'

            const queryName: string = 'queryPersona'
            try {
                const result = await cubaClient.executeQuery(
                    entitiesName,
                    queryName,
                    { names: 'Marco' }
                )
                expect(result.length).toBeGreaterThanOrEqual(1)
            } catch (error) {
                expect(error.response.status).toBe(200)
            }
        }
    )
})
*/
