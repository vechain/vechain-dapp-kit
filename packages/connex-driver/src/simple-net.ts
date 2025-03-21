import { Net } from './interfaces'
import Axios, { AxiosInstance, AxiosError } from 'axios'
import { SimpleWebSocketReader } from './simple-websocket-reader'
import { resolve } from 'url'
import { Agent as HttpAgent } from 'http'
import { Agent as HttpsAgent } from 'https'

/** class simply implements Net interface */
export class SimpleNet implements Net {
    private readonly axios: AxiosInstance

    constructor(
        readonly baseURL: string,
        timeout = 30 * 1000,
        private readonly wsTimeout = 30 * 1000
    ) {
        this.axios = Axios.create({
            httpAgent: new HttpAgent({ keepAlive: true }),
            httpsAgent: new HttpsAgent({ keepAlive: true }),
            baseURL,
            timeout
        })
    }

    public async http(
        method: 'GET' | 'POST',
        path: string,
        params?: Net.Params): Promise<any> {
        params = params || {}
        try {
            const resp = await this.axios.request({
                method,
                url: path,
                data: params.body,
                headers: params.headers,
                params: params.query
            })
            if (params.validateResponseHeader) {
                params.validateResponseHeader(resp.headers)
            }
            return resp.data
        } catch (err) {
            if (err.isAxiosError) {
                throw convertError(err)
            }
            throw new Error(`${method} ${resolve(this.baseURL, path)}: ${err.message}`)
        }
    }
    public openWebSocketReader(path: string): Net.WebSocketReader {
        const url = resolve(this.baseURL, path)
            .replace(/^http:/i, 'ws:')
            .replace(/^https:/i, 'wss:')
        return new SimpleWebSocketReader(url, this.wsTimeout)
    }
}

function convertError(err: AxiosError) {
    if (err.response) {
        const resp = err.response
        if (typeof resp.data === 'string') {
            let text = resp.data.trim()
            if (text.length > 50) {
                text = text.slice(0, 50) + '...'
            }
            return new Error(`${resp.status} ${err.config.method} ${err.config.url}: ${text}`)
        } else {
            return new Error(`${resp.status} ${err.config.method} ${err.config.url}`)
        }
    } else {
        return new Error(`${err.config.method} ${err.config.url}: ${err.message}`)
    }
}
