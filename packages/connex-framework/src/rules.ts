/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function isDecString(val: string) {
    return typeof val === 'string' && /^[0-9]+$/.test(val)
}

export function isHexString(val: string) {
    return typeof val === 'string' && /^0x[0-9a-f]+$/i.test(val)
}

export function isHexBytes(val: string, n?: number) {
    if (typeof val !== 'string' || !/^0x[0-9a-f]*$/i.test(val)) {
        return false
    }
    return n ? val.length === n * 2 + 2 : val.length % 2 === 0
}

export function isUInt(val: number, bit: number) {
    if (val < 0 || !Number.isInteger(val)) {
        return false
    }
    return bit ? val < 2 ** bit : true
}

export function isBigInt(v: number | string) {
    return typeof v === 'string' ?
        (isDecString(v) || isHexString(v)) :
        isUInt(v, 0)
}

export class BadParameter extends Error {
    constructor(msg: string) {
        super(msg)
    }
}
BadParameter.prototype.name = 'BadParameter'

export function ensure(b: boolean, msg: string) {
    if (!b) {
        throw new BadParameter(msg)
    }
}

import * as V from 'validator-ts'

export function test<T>(value: T, scheme: V.Scheme<T>, context: string) {
    try {
        return V.validate(value, scheme, context)
    } catch (err) {
        if (err instanceof V.ValidationError) {
            throw new BadParameter(err.message)
        }
        throw err
    }
}

// rules
export function bytes(v: any) {
    return isHexBytes(v) ? '' : 'expected bytes in hex string'
}
export function bytes8(v: any) {
    return isHexBytes(v, 8) ? '' : 'expected bytes8'
}
export function bytes32(v: any) {
    return isHexBytes(v, 32) ? '' : 'expected bytes32'
}
export function uint8(v: any) {
    return isUInt(v, 8) ? '' : 'expected 8-bit unsigned integer'
}
export function uint32(v: any) {
    return isUInt(v, 32) ? '' : 'expected 32-bit unsigned integer'
}
export function uint64(v: any) {
    return isUInt(v, 64) ? '' : 'expected 64-bit unsigned integer'
}
export function bool(v: any) {
    return typeof v === 'boolean' ? '' : 'expected boolean'
}
export function bigInt(v: any) {
    return isBigInt(v) ? '' : 'expected unsigned integer in number or string'
}
export function hexString(v: any) {
    return isHexString(v) ? '' : 'expected integer in hex string'
}
export function address(v: any) {
    return isHexBytes(v, 20) ? '' : 'expected address'
}
export function string(v: any) {
    return typeof v === 'string' ? '' : 'expected string'
}
