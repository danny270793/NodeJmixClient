# NodeJmixClient2

[![Github pipeline status](https://github.com/danny270793/NodeJmixClient/actions/workflows/releaser.yaml/badge.svg)](https://github.com/danny270793/NodeJmixClient/actions/workflows/releaser.yaml)
![NPM Type Definitions](https://img.shields.io/npm/types/@danny270793/jmixclient)

[![install size](https://packagephobia.com/badge?p=@danny270793/jmixclient)](https://packagephobia.com/result?p=@danny270793/jmixclient)
![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/@danny270793/jmixclient)
![GitHub repo size](https://img.shields.io/github/repo-size/danny270793/NodeJmixClient)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/danny270793/NodeJmixClient)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/min/@danny270793/jmixclient)

![GitHub commit activity](https://img.shields.io/github/commit-activity/m/danny270793/NodeJmixClient)
![NPM Downloads](https://img.shields.io/npm/dy/@danny270793/jmixclient)
![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/danny270793/NodeJmixClient/total)

Library to comunicate with jmix 2.x rest api

## Instalation

Install package from public registry

```bash
npm install @danny270793/jmixclientv2
```

## Examples

Compute the levenshtein distance between two strings

```ts
import JmixClient from '@danny270793/jmixclientv2'
import User from '@danny270793/jmixclientv2/build/entities/user'

const protocol: string = process.env.JMIX_PROTOCOL || ''
const hostname: string = process.env.JMIX_HOSTNAME || ''
const port: number = parseInt(process.env.JMIX_PORT || '')
const username: string = process.env.JMIX_USERNAME || ''
const password: string = process.env.JMIX_PASSWORD || ''
const clientId: string = process.env.JMIX_CLIENT_ID || ''
const clientSecret: string = process.env.JMIX_CLIENT_SECRET || ''

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
console.log({users})
```

## Follow me

[![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?style=for-the-badge&logo=YouTube&logoColor=white)](https://www.youtube.com/channel/UC5MAQWU2s2VESTXaUo-ysgg)
[![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://www.github.com/danny270793/)
[![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/danny270793)

## LICENSE

[![GitHub License](https://img.shields.io/github/license/danny270793/NodeJmixClient)](license.md)

## Version

![GitHub Tag](https://img.shields.io/github/v/tag/danny270793/NodeJmixClient)
![GitHub Release](https://img.shields.io/github/v/release/danny270793/NodeJmixClient)
![GitHub package.json version](https://img.shields.io/github/package-json/v/danny270793/NodeJmixClient)
![NPM Version](https://img.shields.io/npm/v/%40danny270793%2Fjmixclient)

Last update 21/08/2024
