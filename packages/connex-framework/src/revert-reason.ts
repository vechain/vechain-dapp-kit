import { abi, keccak256 } from 'thor-devkit'

// https://docs.soliditylang.org/en/v0.8.16/control-structures.html#error-handling-assert-require-revert-and-exceptions
// builtin errors in solidity, Error(string) and Panic(uint256)

const errorSelector = '0x' + keccak256('Error(string)').toString('hex').slice(0, 8)
const panicSelector = '0x' + keccak256('Panic(uint256)').toString('hex').slice(0, 8)

export function decodeRevertReason(data: string): string {
    try {
        if (data.startsWith(errorSelector)) {
            return abi.decodeParameter('string', '0x' + data.slice(errorSelector.length)) as string
        } else if (data.startsWith(panicSelector)) {
            const decoded = abi.decodeParameter('uint256', '0x' + data.slice(panicSelector.length)) as string
            return `Panic(0x${parseInt(decoded).toString(16).padStart(2, '0')})`
        }
        return ''
    } catch {
        return ''
    }
}
