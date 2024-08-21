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

describe('executeService function', () => {
    test.concurrent(
        'executeService function must return 2 records',
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
            const servicesName: string =
                'cubaserver_LenguajesMasUsadosService'

            const methoName: string = 'getTop'
            try {
                const result = await cubaClient.executeService(
                    servicesName,
                    methoName,
                    {}
                )
                expect(result.length).toEqual(2)
            } catch (error) {
                expect(error.response.status).toBe(200)
            }
        }
    )
})
*/
