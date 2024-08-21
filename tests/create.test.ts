import DotEnv from 'dotenv'
DotEnv.config()

import JmixClient from '../src'
import User from '../src/entities/user'

const protocol: string = process.env.JMIX_PROTOCOL || ''
const hostname: string = process.env.JMIX_HOSTNAME || ''
const port: number = parseInt(process.env.JMIX_PORT || '')
const username: string = process.env.JMIX_USERNAME || ''
const password: string = process.env.JMIX_PASSWORD || ''
const clientId: string = process.env.JMIX_CLIENT_ID || ''
const clientSecret: string = process.env.JMIX_CLIENT_SECRET || ''

describe('createEntity function', () => {
    test.concurrent(
        'createEntity function must create a new record',
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

            const data: User = await jmixClient.createEntity<User>('User', {
                username: `_test_${Date.now()}`,
            })
            expect(data['id']).not.toHaveLength(0)
        },
    )
})
