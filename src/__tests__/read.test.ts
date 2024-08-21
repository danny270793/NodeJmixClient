import DotEnv from 'dotenv'
DotEnv.config()

import JmixClient from '..'
import User from '../entities/user'

const protocol: string = process.env.JMIX_PROTOCOL || ''
const hostname: string = process.env.JMIX_HOSTNAME || ''
const port: number = parseInt(process.env.JMIX_PORT || '')
const username: string = process.env.JMIX_USERNAME || ''
const password: string = process.env.JMIX_PASSWORD || ''
const clientId: string = process.env.JMIX_CLIENT_ID || ''
const clientSecret: string = process.env.JMIX_CLIENT_SECRET || ''

describe('getEntities function', () => {
    test.concurrent('getEntities must return all users', async () => {
        const jmixClient: JmixClient = new JmixClient(
            protocol,
            hostname,
            port,
            username,
            password,
            clientId,
            clientSecret,
        )
        const users: User[] = await jmixClient.getEntities<User>('User')
        expect(users.length).toBeGreaterThanOrEqual(0)
    })

    /*
    test.concurrent('getEntities must return all users with view', async () => {
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
        const gatewayOauthClients: any[] = await jmixClient.getEntities('frac_GatewayAccessToken', 'gatewayAccessToken-with-user-client')
        expect(gatewayOauthClients[0]['client']['_entityName']).not.toBeUndefined()
    })
    */

    test.concurrent.each([[1], [2], [3]])(
        'getEntities must return just %i users',
        async (limit: number) => {
            const jmixClient: JmixClient = new JmixClient(
                protocol,
                hostname,
                port,
                username,
                password,
                clientId,
                clientSecret,
            )
            const users: any[] = await jmixClient.getEntities(
                'User',
                undefined,
                limit,
            )
            expect(users.length).toBe(limit)
        },
    )

    test.concurrent(
        'getEntities must return all users with null values',
        async () => {
            const jmixClient: JmixClient = new JmixClient(
                protocol,
                hostname,
                port,
                username,
                password,
                clientId,
                clientSecret,
            )
            const users: any[] = await jmixClient.getEntities(
                'User',
                undefined,
                undefined,
                undefined,
                undefined,
                true,
            )
            expect(users[0]['firstName']).toBeNull()
        },
    )
})

describe('getEntity function', () => {
    test.concurrent(
        'getEntities function must return the record with the specified id',
        async () => {
            const jmixClient: JmixClient = new JmixClient(
                protocol,
                hostname,
                port,
                username,
                password,
                clientId,
                clientSecret,
            )

            const user: User[] = await jmixClient.getEntities<User>('User')
            const data: User = await jmixClient.getEntity<User>(
                'User',
                user[0].id,
            )
            expect(data['_entityName']).toBe('User')
        },
    )
})

describe('searchEntity function', () => {
    test.concurrent('searchEntity function must return 1 record', async () => {
        const jmixClient: JmixClient = new JmixClient(
            protocol,
            hostname,
            port,
            username,
            password,
            clientId,
            clientSecret,
        )

        const users: User[] = await jmixClient.searchEntity<User>('User', [
            {
                property: 'username',
                operator: '=',
                value: 'admin',
            },
        ])
        expect(users.length).toBe(1)
    })

    test.concurrent('searchEntity function must return 1 records', async () => {
        const jmixClient: JmixClient = new JmixClient(
            protocol,
            hostname,
            port,
            username,
            password,
            clientId,
            clientSecret,
        )
        const users: User[] = await jmixClient.searchEntity<User>('User', [
            {
                group: 'OR',
                conditions: [
                    {
                        property: 'username',
                        operator: '=',
                        value: 'admin',
                    },
                ],
            },
        ])
        expect(users.length).toBe(1)
    })

    test.concurrent('searchEntity function must return 1 records', async () => {
        const jmixClient: JmixClient = new JmixClient(
            protocol,
            hostname,
            port,
            username,
            password,
            clientId,
            clientSecret,
        )
        const users: User[] = await jmixClient.searchEntity<User>(
            'User',
            [
                {
                    group: 'OR',
                    conditions: [
                        {
                            property: 'username',
                            operator: '=',
                            value: 'admin',
                        },
                        {
                            property: 'username',
                            operator: '=',
                            value: 'anonymous',
                        },
                    ],
                },
            ],
            undefined,
            1,
        )
        expect(users.length).toBe(1)
    })
})
