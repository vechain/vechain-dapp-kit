import * as WebSocket from 'isomorphic-ws';
import { Net } from './interfaces';

export class SimpleWebSocketReader implements Net.WebSocketReader {
    private readonly ws: WebSocket;
    private callbacks = [] as Array<(data: any, error?: Error) => void>;
    private error?: Error;

    constructor(url: string, private readonly timeout = 30 * 1000) {
        this.ws = new WebSocket(url);
        this.ws.onmessage = (ev) => {
            try {
                const cbs = this.callbacks;
                this.callbacks = [];
                cbs.forEach((cb) => cb(ev.data));
            } catch (err) {
                this.setError(err);
                this.ws.close();
            }
        };
        this.ws.onerror = (ev) => {
            this.setError(ev.error);
            this.ws.close();
        };
        this.ws.onclose = () => {
            this.setError(new Error('closed'));
        };
    }

    public read(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (this.error) {
                return reject(this.error);
            }

            const timer = setTimeout(() => {
                reject(new Error('ws read timeout'));
            }, this.timeout);

            this.callbacks.push((data, err) => {
                clearTimeout(timer);
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
    }

    public close(): void {
        this.ws.close();
    }

    private setError(err: Error) {
        if (!this.error) {
            this.error = err;

            const cbs = this.callbacks;
            this.callbacks = [];
            cbs.forEach((cb) => cb(null, err));
        }
    }
}
