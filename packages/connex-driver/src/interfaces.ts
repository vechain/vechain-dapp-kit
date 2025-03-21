
/** Net interface supports http transport */
export interface Net {
    /** base URL */
    readonly baseURL: string

    /**
     * perform http request
     * @param method 'GET' or 'POST'
     * @param path path to access
     * @param params additional params
     * @returns response body, JSON decoded
     */
    http(
        method: 'GET' | 'POST',
        path: string,
        params?: Net.Params
    ): Promise<any>

    /**
     * open websocket reader on path
     * @param path
     */
    openWebSocketReader(path: string): Net.WebSocketReader
}

export namespace Net {
    /** http request params */
    export interface Params {
        query?: Record<string, string>
        body?: any // will be encoded to JSON
        headers?: Record<string, string>
        validateResponseHeader?: (headers: Record<string, string>) => void
    }

    /** websocket reader */
    export interface WebSocketReader {
        /** read data */
        read(): Promise<any>
        close(): void
    }
}

/** Wallet interface manages private keys */
export interface Wallet {
    /** list all keys */
    readonly list: Wallet.Key[]
}

export namespace Wallet {
    /** describes an operational key */
    export interface Key {
        /** address derived from key */
        address: string
        /**
         * sign message hash
         * @param msgHash message hash
         * @returns signature
         */
        sign(msgHash: Buffer): Promise<Buffer>
    }
}
