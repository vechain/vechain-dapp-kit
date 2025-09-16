import { CertificateMessage, TypedDataMessage } from '../../src';

export const certMessage: CertificateMessage = {
    purpose: 'identification',
    payload: {
        type: 'text',
        content: 'Hello World',
    },
};

export const typedDataMessage: TypedDataMessage = {
    domain: {
        name: 'Ether Mail',
        version: '1',
        chainId: BigInt(
            '1176455790972829965191905223412607679856028701100105089447013101863',
        ),
        verifyingContract: '0x1CAB02Ec1922F1a5a55996de8c590161A88378b9',
    },
    types: {
        Person: [
            { name: 'name', type: 'string' },
            { name: 'wallet', type: 'address' },
        ],
        Mail: [
            { name: 'from', type: 'Person' },
            { name: 'to', type: 'Person' },
            { name: 'contents', type: 'string' },
        ],
    },
    value: {
        from: {
            name: 'Cow',
            wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
        },
        to: {
            name: 'Bob',
            wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
        },
        contents: 'Hello, Bob!',
    },
};
