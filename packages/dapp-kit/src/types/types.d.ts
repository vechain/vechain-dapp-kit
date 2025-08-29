import type { CertificateData } from '@vechain/sdk-core';
import type {
    CompressedBlockDetail,
    SignTypedDataOptions,
} from '@vechain/sdk-network';
import type {
    CertificateMessage,
    CertificateOptions,
    CertificateResponse,
    TransactionMessage,
    TransactionOptions,
    TransactionResponse,
} from './requests';

declare global {
    interface Window {
        vechain?: {
            newConnexSigner: (genesisId: string) => WalletSigner;
            isInAppBrowser?: boolean;
        } & WalletProvider;
        connex?: {
            vendor: {
                sign: (type: string) => any;
            };
        };
    }
}

type WalletSource = 'wallet-connect' | 'veworld' | 'sync' | 'sync2';

type TypedDataDomain = {
    chainId?: number | bigint | undefined;
    name?: string | undefined;
    salt?: `0x${string}` | undefined;
    verifyingContract?: string | undefined;
    version?: string | undefined;
};

type TypedDataParameter = {
    name: string;
    type: string;
};

interface WalletConfig {
    requiresCertificate: boolean;
}

type Genesis = 'main' | 'test' | CompressedBlockDetail;

type TypedDataMessage = {
    domain: TypedDataDomain;
    types: Record<string, TypedDataParameter[]>;
    value: Record<string, unknown>;
};

/**
 * Simple Certificate Args
 */
type CertificateArgs = {
    message: CertificateMessage;
    options?: CertificateOptions;
};

/**
 * Callback used by the DAppKit `connect` function
 */
type ConnectCallback = (
    _certificate?: CertificateArs,
) => Promise<ConnectResponse>;

type ConnectV2Response<
    TValue extends null | CertificateMessage | TypedDataMessage,
> = TValue extends null
    ? { signer: string }
    : TValue extends { purpose: string }
      ? CertificateResponse
      : { signer: string; signature: string };

/**
 * Callback used by the DAppKit `newConnect` function
 */
type ConnectV2Callback = <
    TValue extends null | CertificateMessage | TypedDataMessage,
>(
    value: TValue,
    /**
     * Indicate that the dApp uses an external authentication service.
     * Keep me logged in toggle will be disabled when this option is set to true
     */
    external?: boolean,
) => Promise<ConnectV2Response<TValue>>;

interface WalletSigner {
    signTx: (
        msg: TransactionMessage[],
        options: TransactionOptions,
    ) => Promise<TransactionResponse>;
    signCert: (
        msg: CertificateMessage,
        options: CertificateOptions,
    ) => Promise<CertificateResponse>;
    signTypedData?: (
        domain: TypedDataDomain,
        types: Record<string, TypedDataParameter[]>,
        message: Record<string, unknown>,
        options?: SignTypedDataOptions,
    ) => Promise<string>;
}

interface WalletProvider {
    send?(args: {
        method: 'thor_connect';
        params: {
            value: TypedDataMessage | CertificateMessage | null;
            external?: boolean;
        };
        genesisId: string;
    }): Promise<
        | CertificateResponse
        | { signer: string; signature: string }
        | { signer: string }
    >;
    send?(args: {
        method: 'thor_wallet';
        params?: undefined;
        genesisId: string;
    }): Promise<string>;
    send?(args: {
        method: 'thor_disconnect';
        params?: undefined;
        genesisId: string;
    }): Promise<void>;
    send?(args: {
        method: 'thor_switchWallet';
        params?: undefined;
        genesisId: string;
    }): Promise<string>;
    send?(args: {
        method: 'thor_methods';
        params?: undefined;
        genesisId: string;
    }): Promise<string[]>;
    send?(args: {
        method: 'thor_signTypedData';
        params: {
            domain: TypedDataDomain;
            types: Record<string, TypedDataParameter[]>;
            value: Record<string, unknown>;
            options?: SignTypedDataOptions;
        };
        genesisId: string;
    }): Promise<string>;
    send?(args: {
        method: 'thor_signCertificate';
        params: {
            message: CertificateMessage;
            options: CertificateOptions;
        };
        genesisId: string;
    }): Promise<string>;
    send?(args: {
        method: 'thor_sendTransaction';
        params: {
            clauses: TransactionMessage;
            options?: TransactionOptions;
        };
        genesisId: string;
    }): Promise<string>;
}

/**
 * Modifies the WalletSigner interface to include a disconnect method
 */
type VeChainWallet = WalletSigner & {
    connect: ConnectCallback;
    disconnect?: () => void | Promise<void>;
    getAddress: () => string | null | Promise<string | null>;
    getAvailableMethods: () => string[] | null | Promise<string[] | null>;
    connectV2: ConnectV2Callback;
    switchWallet: () => string | null | Promise<string | null>;
};

interface ConnectResponse {
    account: string;
    verified: boolean;
    connectionCertificate?: CertificateData;
}

interface WalletManagerState {
    source: WalletSource | null;
    address: string | null;
    accountDomain: string | null;
    isAccountDomainLoading: boolean;
    availableSources: WalletSource[];
    connectionCertificate: CertificateData | null;
    availableMethods: string[] | null;
}

export type {
    CertificateArgs,
    ConnectCallback,
    ConnectResponse,
    ConnectV2Callback,
    ConnectV2Response,
    Genesis,
    SignTypedDataOptions,
    TypedDataMessage,
    VeChainWallet,
    WalletConfig,
    WalletManagerState,
    WalletProvider,
    WalletSigner,
    WalletSource,
};
