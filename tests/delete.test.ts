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

describe('deleteEntity function', () => {
    test.concurrent('deleteEntity function must delete a record', async () => {
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
                operator: 'contains',
                value: '_test_',
            },
        ])
        for (const user of users) {
            await jmixClient.deleteEntity<User>('User', user.id)
        }
    })
})
