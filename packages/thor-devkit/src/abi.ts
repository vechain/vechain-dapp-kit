import { AbiCoder, formatSignature as _formatSignature } from '@vechain/ethers/utils/abi-coder'
import { keccak256 } from './keccak'
import { Buffer } from 'buffer'

class Coder extends AbiCoder {
    constructor() {
        super((type, value) => {
            if ((type.match(/^u?int/) && !Array.isArray(value) && typeof value !== 'object') ||
                value._ethersType === 'BigNumber') {
                return value.toString()
            }
            return value
        })
    }

    public encode(types: Array<string|abi.Function.Parameter>, values: any[]): string {
        try {
            return super.encode(types, values)
        } catch (err) {
            if (err.reason) {
                throw new Error(err.reason)
            }
            throw err
        }
    }

    public decode(types: Array<string|abi.Function.Parameter>, data: string): any[] {
        try {
            return super.decode(types, data)
        } catch (err) {
            if (err.reason) {
                throw new Error(err.reason)
            }
            throw err
        }
    }
}

const coder = new Coder()

function formatSignature(fragment: any) {
    try {
        return _formatSignature(fragment)
            .replace(/\(tuple\(/g, '((')
            .replace(/,tuple\(/g, ',(')
    } catch (err) {
        if (err.reason) {
            throw new Error(err.reason)
        }
        throw err
    }
}

/** encode/decode parameters of contract function call, event log, according to ABI JSON */
export namespace abi {

    /**
     * encode single parameter
     * @param type type of the parameter
     * @param value value of the parameter
     * @returns encoded value in hex string
     */
    export function encodeParameter(type: string, value: any) {
        return coder.encode([type], [value])
    }

    /**
     * decode single parameter
     * @param type type of the parameter
     * @param data encoded parameter in hex string
     * @returns decoded value
     */
    export function decodeParameter(type: string, data: string) {
        return coder.decode([type], data)[0]
    }

    /**
     * encode a group of parameters
     * @param types type array
     * @param values value array
     * @returns encoded values in hex string
     */
    export function encodeParameters(types: Function.Parameter[], values: any[]) {
        return coder.encode(types, values)
    }

    /**
     * decode a group of parameters
     * @param types type array
     * @param data encoded values in hex string
     * @returns decoded object
     */
    export function decodeParameters(types: Function.Parameter[], data: string) {
        const result = coder.decode(types, data)
        const decoded: Decoded = {}
        types.forEach((t, i) => {
            decoded[i] = result[i]
            if (t.name) {
                decoded[t.name] = result[i]
            }
        })
        return decoded
    }

    /** for contract function */
    export class Function {
        /** canonical name */
        public readonly canonicalName: string

        /** the function signature, aka. 4 bytes prefix */
        public readonly signature: string

        /**
         * create a function object
         * @param definition abi definition of the function
         */
        constructor(public readonly definition: Function.Definition) {
            this.canonicalName = formatSignature(definition)
            this.signature = '0x' + keccak256(this.canonicalName).slice(0, 4).toString('hex')
        }

        /**
         * encode input parameters into call data
         * @param args arguments for the function
         */
        public encode(...args: any[]): string {
            return this.signature + encodeParameters(this.definition.inputs, args).slice(2)
        }

        /**
         * decode output data
         * @param outputData output data to decode
         */
        public decode(outputData: string) {
            return decodeParameters(this.definition.outputs, outputData)
        }
    }

    export namespace Function {
        export type StateMutability = 'pure' | 'view' | 'constant' | 'payable' | 'nonpayable'
        export interface Parameter {
            name: string
            type: string
            components?: any[] // Tuples ONLY
            internalType?: string
        }

        export interface Definition {
            type: 'function'
            name: string
            constant?: boolean
            payable?: boolean
            stateMutability: StateMutability
            inputs: Parameter[]
            outputs: Parameter[]
        }
    }

    /** for contract event */
    export class Event {
        /** canonical name */
        public readonly canonicalName: string

        /** the event signature */
        public readonly signature: string

        /** for contract event */
        constructor(public readonly definition: Event.Definition) {
            this.canonicalName = formatSignature(definition)
            this.signature = '0x' + keccak256(this.canonicalName).toString('hex')
        }

        /**
         * encode an object of indexed keys into topics.
         * @param indexed an object contains indexed keys
         */
        public encode(indexed: object): Array<string | null> {
            const topics: Array<string | null> = []
            if (!this.definition.anonymous) {
                topics.push(this.signature)
            }
            for (const input of this.definition.inputs) {
                if (!input.indexed) {
                    continue
                }
                const value = (indexed as any)[input.name]
                if (value === undefined || value === null) {
                    topics.push(null)
                } else {
                    let topic
                    // https://docs.soliditylang.org/en/v0.8.11/abi-spec.html#encoding-of-indexed-event-parameters
                    if (isValueType(input.type)) {
                        topic = encodeParameter(input.type, value)
                    } else {
                        if (input.type === 'string') {
                            topic = '0x' + keccak256(value).toString('hex')
                        } else if (typeof value === 'string' && /^0x[0-9a-f]+$/i.test(value) && value.length % 2 === 0) {
                            // value is encoded
                            topic = '0x' + keccak256(Buffer.from(value.slice(2), 'hex')).toString('hex')
                        } else {
                            throw new Error(`event.encode: invalid ${input.type} value`)
                        }
                    }
                    topics.push(topic)
                }
            }
            return topics
        }

        /**
         * decode event log
         * @param data data in event output
         * @param topics topics in event
         */
        public decode(data: string, topics: string[]) {
            if (!this.definition.anonymous) {
                topics = topics.slice(1)
            }

            if (this.definition.inputs.filter(t => t.indexed).length !== topics.length) {
                throw new Error('invalid topics count')
            }

            const decodedNonIndexed = coder.decode(
                this.definition.inputs.filter(t => !t.indexed), data)
            
            const decoded: Decoded = {}
            this.definition.inputs.forEach((t, i) => {
                if (t.indexed) {
                    const topic = topics.shift()!
                    decoded[i] = isValueType(t.type) ? decodeParameter(t.type, topic) : topic 
                } else {
                    decoded[i] = decodedNonIndexed.shift()
                }
                if (t.name) {
                    decoded[t.name] = decoded[i]
                }
            })
            return decoded
        }
    }

    export namespace Event {
        export interface Parameter {
            name: string
            type: string
            indexed: boolean
            components?: any[] // Tuples ONLY
            internalType?: string
        }

        export interface Definition {
            type: 'event'
            name: string
            anonymous?: boolean
            inputs: Parameter[]
        }
    }

    export type Decoded = { [name: string]: any } & { [index: number]: any }

    function isValueType(type: string) {
        return (
            type === "address" ||
            type === "bool" ||
            /^(u?int)(\d*)$/.test(type) ||
            /^bytes(\d+)$/.test(type)
        )
    }
}
