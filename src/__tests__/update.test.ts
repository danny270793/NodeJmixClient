import DotEnv from 'dotenv'
import JmixClient from '..'
DotEnv.config()

import User from '../entities/user'

const protocol: string = process.env.JMIX_PROTOCOL || ''
const hostname: string = process.env.JMIX_HOSTNAME || ''
const port: number = parseInt(process.env.JMIX_PORT || '')
const username: string = process.env.JMIX_USERNAME || ''
const password: string = process.env.JMIX_PASSWORD || ''
const clientId: string = process.env.JMIX_CLIENT_ID || ''
const clientSecret: string = process.env.JMIX_CLIENT_SECRET || ''

describe('updateEntity function', () => {
    test.concurrent(
        'updateEntity function must update the selected description record',
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
            const toBeUpdatedUsers: User[] =
                await jmixClient.searchEntity<User>('User', [
                    {
                        property: 'username',
                        operator: '=',
                        value: 'toBeUpdated',
                    },
                ])
            for (const user of toBeUpdatedUsers) {
                await jmixClient.deleteEntity('User', user.id)
            }

            const alreadyBeUpdatedUsers: User[] =
                await jmixClient.searchEntity<User>('User', [
                    {
                        property: 'username',
                        operator: '=',
                        value: 'alreadyBeUpdated',
                    },
                ])
            for (const user of alreadyBeUpdatedUsers) {
                await jmixClient.deleteEntity('User', user.id)
            }

            const user: User = await jmixClient.createEntity<User>('User', {
                username: 'toBeUpdated',
            })
            await jmixClient.updateEntity<User>('User', user.id, {
                username: 'alreadyBeUpdated',
            })

            const updatedUser: User = await jmixClient.getEntity(
                'User',
                user.id
            )
            expect(updatedUser.username).toBe('alreadyBeUpdated')
        }
    )
})
