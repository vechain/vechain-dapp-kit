import { vi } from 'vitest';
import type {
    EngineTypes,
    IEngine,
} from '@walletconnect/types/dist/types/sign-client/engine';
import type { SessionTypes } from '@walletconnect/types';
import type {
    CertificateResponse,
    ResolvedSignClient,
    TransactionResponse,
} from '../../src';
import { DefaultMethods } from '../../src';
import { wcSessionStruct } from './wc-fixtures';
import { address, mockedConnexSigner } from './mocked-signer';
import { Blake2b256 } from '@vechain/sdk-core';

const requestHandler: IEngine['request'] = vi.fn();
const connectHandler: IEngine['connect'] = vi.fn();
const disconnectHandler: IEngine['disconnect'] = vi.fn();

const defaultMockConnectHandler = (): ReturnType<IEngine['connect']> => {
    return Promise.resolve({
        uri: 'wc://test',
        approval: (): Promise<SessionTypes.Struct> => {
            return Promise.resolve(wcSessionStruct);
        },
    });
};

const defaultMockRequestHandler = (
    params: EngineTypes.RequestParams,
): Promise<CertificateResponse | TransactionResponse> => {
    if (params.request.method === DefaultMethods.RequestTransaction) {
        return Promise.resolve({
            txid: '0x123',
            signer: address.toString(),
        });
    } else if (params.request.method === DefaultMethods.SignCertificate) {
        return Promise.resolve(
            mockedConnexSigner.signCert(
                params.request.params[0].message,
                params.request.params[0].options,
            ),
        );
    } else if (params.request.method === DefaultMethods.SignTypedData) {
        return Promise.resolve(
            mockedConnexSigner.signTypedData(
                params.request.params[0].domain,
                params.request.params[0].types,
                params.request.params[0].value,
            ),
        );
    }
    throw new Error('Invalid method');
};

const mockedSignClient = {
    on: vi.fn(),
    request: requestHandler,
    disconnect: disconnectHandler,
    connect: connectHandler,
    session: {
        keys: [],
        get: vi.fn(),
    },
    name: Blake2b256.random(12).toString(),
} as unknown as ResolvedSignClient;

vi.mocked(mockedSignClient.request).mockImplementation(
    defaultMockRequestHandler,
);
vi.mocked(mockedSignClient.connect).mockImplementation(
    defaultMockConnectHandler,
);
vi.mocked(mockedSignClient.disconnect).mockImplementation((): Promise<void> => {
    return Promise.resolve();
});

export { mockedSignClient };
