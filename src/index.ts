import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import BaseResponse from './responses/base-response'
import LoginResponse from './responses/login-response'
import CreateFileResponse from './responses/create-file-response'
import Logger from './logger'
import Query from './entities/query'
import FormData from 'form-data'
import Fs, { WriteStream } from 'fs'
import { Stream } from 'stream'

export interface GroupCondition<T extends BaseResponse> {
    group: string
    conditions: Condition<T>[]
}

export interface Condition<T extends BaseResponse> {
    property: keyof T | string
    operator: string
    value: string | string[]
}

/**
 * REST client to comunicate with cuba backend, you can find more information at https://files.cuba-platform.com/swagger/7.1/#/
 */
export default class JmixClient {
    private protocol: string
    private hostname: string
    private port: number
    private username: string
    private password: string
    private clientId: string
    private clientSecret: string
    private baseUrl: string
    private authotizationBase64: string
    private loginResponse: LoginResponse | undefined

    constructor(
        protocol: string,
        hostname: string,
        port: number,
        username: string,
        password: string,
        clientId: string,
        clientSecret: string
    ) {
        this.protocol = protocol
        this.hostname = hostname
        this.port = port
        this.username = username
        this.password = password
        this.clientId = clientId
        this.clientSecret = clientSecret

        this.baseUrl = `${this.protocol}://${this.hostname}:${this.port}`

        const authotization: string = `${this.clientId}:${this.clientSecret}`
        const authotizationBuffer: Buffer = Buffer.from(authotization)
        this.authotizationBase64 = authotizationBuffer.toString('base64')
    }

    async login(username: string, password: string): Promise<LoginResponse> {
        const request: AxiosRequestConfig = {
            method: 'post',
            url: `${this.baseUrl}/oauth/token`,
            headers: {
                Authorization: `Basic ${this.authotizationBase64}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            params: {
                username,
                password,
                grant_type: 'password',
            },
        }
        const response: AxiosResponse = await this.executeWithoutRetries(
            request
        )
        return {
            accessToken: response.data['access_token'],
            tokenType: response.data['token_type'],
            refreshToken: response.data['refresh_token'],
            expiresIn: response.data['expires_in'],
            scope: response.data['scope'],
        }
    }

    async getAccessTokens(): Promise<LoginResponse> {
        return await this.login(this.username, this.password)
    }

    async revokeAccessTokens(): Promise<void> {
        const request: AxiosRequestConfig = {
            method: 'post',
            url: `${this.baseUrl}/oauth/revoke`,
            headers: {
                Authorization: `Basic ${this.authotizationBase64}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            params: {
                token: this.loginResponse?.accessToken,
                token_type_hint: 'access_token',
            },
        }
        await this.executeWithoutRetries(request)
    }

    async refreshAccessTokens(): Promise<LoginResponse> {
        try {
            const request: AxiosRequestConfig = {
                method: 'post',
                url: `${this.baseUrl}/oauth/token`,
                headers: {
                    Authorization: `Basic ${this.authotizationBase64}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                params: {
                    refresh_token: this.loginResponse?.refreshToken,
                    grant_type: 'refresh_token',
                },
            }
            const response: AxiosResponse = await this.executeWithoutRetries(
                request
            )
            return {
                accessToken: response.data['access_token'],
                tokenType: response.data['token_type'],
                refreshToken: response.data['refresh_token'],
                expiresIn: response.data['expires_in'],
                scope: response.data['scope'],
            }
        } catch (error: any) {
            if (error.response) {
                if (
                    error.response.data.error_description?.indexOf(
                        'Invalid refresh token'
                    ) >= 0
                ) {
                    return await this.getAccessTokens()
                }
            }
            throw error
        }
    }

    async revokeRefreshTokens(): Promise<void> {
        const request: AxiosRequestConfig = {
            method: 'post',
            url: `${this.baseUrl}/oauth/revoke`,
            headers: {
                Authorization: `Basic ${this.authotizationBase64}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            params: {
                token: this.loginResponse?.refreshToken,
                token_type_hint: 'refresh_token',
            },
        }
        await this.executeWithoutRetries(request)
    }

    async getEntities<T extends BaseResponse>(
        entity: string,
        view: string | undefined = undefined,
        limit: number | undefined = undefined,
        offset: number | undefined = undefined,
        sort: string | undefined = undefined,
        returnNulls: boolean | undefined = undefined,
        returnCount: boolean | undefined = undefined,
        dynamicAttributes: boolean | undefined = undefined
    ): Promise<T[]> {
        const request: AxiosRequestConfig = {
            method: 'get',
            url: `${this.baseUrl}/rest/entities/${entity}`,
            params: {
                view,
                limit,
                offset,
                sort,
                returnNulls,
                returnCount,
                dynamicAttributes,
            },
            headers: {
                Authorization: `Bearer ${this.loginResponse?.accessToken}`,
            },
        }
        const response: AxiosResponse = await this.executeWithRetries(request)
        return response.data
    }

    async createEntity<T extends BaseResponse>(
        entity: string,
        payload: Partial<T>
    ): Promise<T> {
        const request: AxiosRequestConfig = {
            method: 'post',
            url: `${this.baseUrl}/rest/entities/${entity}`,
            data: payload,
            headers: {
                Authorization: `Bearer ${this.loginResponse?.accessToken}`,
            },
        }
        const response: AxiosResponse = await this.executeWithRetries(request)
        return response.data
    }

    async deleteEntity<T extends BaseResponse>(
        entity: string,
        id: string
    ): Promise<T> {
        const request: AxiosRequestConfig = {
            method: 'delete',
            url: `${this.baseUrl}/rest/entities/${entity}/${id}`,
            headers: {
                Authorization: `Bearer ${this.loginResponse?.accessToken}`,
            },
        }
        const response: AxiosResponse<T> = await this.executeWithRetries(
            request
        )
        return response.data
    }

    async getEntity<T extends BaseResponse>(
        entity: string,
        id: string,
        view: string | undefined = undefined,
        returnNulls: boolean | undefined = undefined,
        dynamicAttributes: boolean | undefined = undefined
    ): Promise<T> {
        const request: AxiosRequestConfig = {
            method: 'get',
            url: `${this.baseUrl}/rest/entities/${entity}/${id}`,
            params: {
                view,
                returnNulls,
                dynamicAttributes,
            },
            headers: {
                Authorization: `Bearer ${this.loginResponse?.accessToken}`,
            },
        }
        const response: AxiosResponse = await this.executeWithRetries(request)
        return response.data
    }

    async updateEntity<T extends BaseResponse>(
        entity: string,
        id: string,
        payload: Partial<T>
    ): Promise<T> {
        const request: AxiosRequestConfig = {
            method: 'put',
            url: `${this.baseUrl}/rest/entities/${entity}/${id}`,
            data: payload,
            headers: {
                Authorization: `Bearer ${this.loginResponse?.accessToken}`,
            },
        }
        const response: AxiosResponse = await this.executeWithRetries(request)
        return response.data
    }

    async searchEntity<T extends BaseResponse>(
        entity: string,
        conditions: (GroupCondition<T> | Condition<T>)[],
        view: string | undefined = undefined,
        limit: number | undefined = undefined,
        offset: number | undefined = undefined,
        sort: string | undefined = undefined,
        returnNulls: boolean | undefined = undefined,
        returnCount: boolean | undefined = undefined,
        dynamicAttributes: boolean | undefined = undefined
    ): Promise<T[]> {
        const request: AxiosRequestConfig = {
            method: 'post',
            url: `${this.baseUrl}/rest/entities/${entity}/search`,
            data: {
                filter: {
                    conditions,
                },
                view,
                limit,
                offset,
                sort,
                returnNulls,
                returnCount,
                dynamicAttributes,
            },
            headers: {
                Authorization: `Bearer ${this.loginResponse?.accessToken}`,
            },
        }
        const response: AxiosResponse = await this.executeWithRetries(request)
        return response.data
    }

    async getQueries(entity: string): Promise<Query[]> {
        const request: AxiosRequestConfig = {
            method: 'get',
            url: `${this.baseUrl}/rest/queries/${entity}`,
            headers: {
                Authorization: `Bearer ${this.loginResponse?.accessToken}`,
            },
        }
        const response: AxiosResponse<Query[]> = await this.executeWithRetries(
            request
        )
        return response.data
    }

    async executeQuery<T extends BaseResponse>(
        entity: string,
        query: string,
        payload: Partial<T>,
        view: string | undefined = undefined,
        limit: number | undefined = undefined,
        offset: number | undefined = undefined,
        returnNulls: boolean | undefined = undefined,
        returnCount: boolean | undefined = undefined,
        dynamicAttributes: boolean | undefined = undefined
    ): Promise<T[]> {
        const request: AxiosRequestConfig = {
            method: 'post',
            url: `${this.baseUrl}/rest/queries/${entity}/${query}`,
            params: {
                view,
                limit,
                offset,
                returnNulls,
                returnCount,
                dynamicAttributes,
            },
            data: payload,
            headers: {
                Authorization: `Bearer ${this.loginResponse?.accessToken}`,
            },
        }
        const response: AxiosResponse<T[]> = await this.executeWithRetries(
            request
        )
        return response.data
    }

    async executeService<T, U>(
        className: string,
        method: string,
        payload: U
    ): Promise<T> {
        const request: AxiosRequestConfig = {
            method: 'post',
            url: `${this.baseUrl}/rest/services/${className}/${method}`,
            data: payload,
            headers: {
                Authorization: `Bearer ${this.loginResponse?.accessToken}`,
            },
        }
        const response: AxiosResponse = await this.executeWithRetries(request)
        return response.data
    }

    async getServices(className: string): Promise<any> {
        const request: AxiosRequestConfig = {
            method: 'get',
            url: `${this.baseUrl}/rest/services/${className}`,
            headers: {
                Authorization: `Bearer ${this.loginResponse?.accessToken}`,
            },
        }
        const response: AxiosResponse = await this.executeWithRetries(request)
        return response.data
    }

    async downloadFile(id: string, path: string): Promise<void> {
        const strem: Stream = await this.getFileAsStream(id)

        const writeStream: WriteStream = Fs.createWriteStream(path)
        strem.pipe(writeStream)

        await new Promise((resolve, reject) => {
            writeStream.on('finish', resolve)
            writeStream.on('error', reject)
        })
    }

    async getFileAsStream(id: string): Promise<Stream> {
        const request: AxiosRequestConfig = {
            method: 'get',
            url: `${this.baseUrl}/rest/files/${id}`,
            responseType: 'stream',
            headers: {
                Authorization: `Bearer ${this.loginResponse?.accessToken}`,
            },
        }
        const response: AxiosResponse<Stream> = await this.executeWithRetries(
            request
        )
        return response.data
    }

    async uploadFileFromPath(path: string): Promise<CreateFileResponse> {
        const formData: FormData = new FormData()
        const readStream: Fs.ReadStream = Fs.createReadStream(path)
        formData.append('file', readStream)

        const request: AxiosRequestConfig = {
            method: 'POST',
            url: `${this.baseUrl}/rest/files`,
            headers: {
                Authorization: `Bearer ${this.loginResponse?.accessToken}`,
                ...formData.getHeaders(),
            },
            data: formData,
        }
        const response: AxiosResponse = await this.executeWithRetries(request)
        return response.data
    }

    async uploadFileFromBuffer(
        content: Buffer,
        name: string | undefined = undefined,
        contentType: string = 'image/jpeg'
    ): Promise<CreateFileResponse> {
        const request: AxiosRequestConfig = {
            method: 'post',
            url: `${this.baseUrl}/rest/files`,
            params: {
                name,
            },
            data: content,
            headers: {
                Authorization: `Bearer ${this.loginResponse?.accessToken}`,
                'Content-Type': contentType,
            },
        }
        const response: AxiosResponse = await this.executeWithRetries(request)
        return response.data
    }

    /**
     * Make a request to CUBA REST API and log the requests sent and the error received if a errores was received
     * @param axiosRequestConfig the configuration of the request
     * @returns the response received from the CUBA REST API
     */
    protected async executeAxiosAndLog(
        axiosRequestConfig: AxiosRequestConfig
    ): Promise<AxiosResponse> {
        try {
            Logger.debug({
                class: JmixClient.name,
                request: axiosRequestConfig,
            })
            return await Axios(axiosRequestConfig)
        } catch (error) {
            const axiosError: AxiosError = error as AxiosError
            if (axiosError.response === undefined) {
                const nodeError: Error = error as Error
                Logger.error({
                    class: JmixClient.name,
                    error: {
                        stack: nodeError.stack?.split('\n'),
                        message: nodeError.message,
                    },
                })
            } else {
                axiosError.response.request = undefined
                Logger.error({
                    class: JmixClient.name,
                    response: axiosError.response,
                })
            }
            throw error
        }
    }

    protected async executeWithoutRetries(
        request: AxiosRequestConfig
    ): Promise<AxiosResponse> {
        return await this.executeAxiosAndLog(request)
    }

    protected async executeWithRetries(
        request: AxiosRequestConfig
    ): Promise<AxiosResponse> {
        if (this.loginResponse === undefined) {
            this.loginResponse = await this.getAccessTokens()
            if (request.headers === undefined) throw Error('null headers')
            request.headers.Authorization = `Bearer ${this.loginResponse?.accessToken}`
        }

        try {
            return await this.executeWithoutRetries(request)
        } catch (error: any) {
            if (error.response) {
                if (
                    error.response.data.error_description?.indexOf(
                        'Invalid access token'
                    ) >= 0
                ) {
                    this.loginResponse = await this.refreshAccessTokens()
                    if (request.headers === undefined)
                        throw Error('null headers')
                    request.headers.Authorization = `Bearer ${this.loginResponse?.accessToken}`
                    return this.executeWithRetries(request)
                }
            }
            throw error
        }
    }
}
