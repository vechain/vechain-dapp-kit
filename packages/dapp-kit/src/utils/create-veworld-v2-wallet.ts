import type {
    SignTypedDataOptions,
    TypedDataDomain,
    TypedDataParameter,
} from '@vechain/sdk-network';
import type {
    CertificateMessage,
    CertificateOptions,
    CertificateResponse,
    TransactionMessage,
    TransactionOptions,
    TransactionResponse,
} from '../types/requests';
import type { TypedDataMessage, WalletProvider, WalletSigner } from '../types';

/**
 * VeWorld's actual in-page API surface — EIP-1193 style.
 * Not formally typed by `WalletProvider` (which assumes a `send`-style
 * interface), so we treat it loosely here.
 */
type VeWorldRequestArgs = {
    method: string;
    params?: unknown;
};
type VeWorldRequestFn = (args: VeWorldRequestArgs) => Promise<unknown>;

/**
 * Methods that we expose to dapp-kit as "available" so that:
 *   - `WalletManager.connectV2` takes the v2 path (`thor_connect`)
 *   - `CertificateBasedWallet.disconnect` is allowed to call `thor_disconnect`
 *   - Consumers see the signing capabilities advertised by the extension
 *
 * `thor_wallet` is intentionally omitted: VeWorld does not expose a way to
 * read the current address without prompting the user (we'd have to call
 * `eth_requestAccounts`), so we rely on the cached `state.address`.
 * `thor_switchWallet` is omitted for the same reason.
 */
const ADVERTISED_V2_METHODS = [
    'thor_connect',
    'thor_methods',
    'thor_disconnect',
    'thor_signCertificate',
    'thor_signTypedData',
    'thor_sendTransaction',
    'wallet_requestPermissions',
    'wallet_revokeAccountPermission',
];

/**
 * Call `eth_requestAccounts` and normalize the response to an array. VeWorld
 * (extension) already returns the full list of approved addresses for the
 * current origin; older builds may return a single string.
 */
const readApprovedAccounts = async (
    request: VeWorldRequestFn,
): Promise<string[]> => {
    const raw = (await request({ method: 'eth_requestAccounts' })) as
        | string[]
        | string
        | null;
    if (Array.isArray(raw)) return raw;
    if (raw) return [raw];
    return [];
};

/**
 * Same as {@link readApprovedAccounts} but swallows errors and returns `[]`.
 * Used in cert / typed-data branches where the dApp has already obtained a
 * signature and the missing list shouldn't fail the connect.
 */
const safeReadApprovedAccounts = async (
    request: VeWorldRequestFn,
): Promise<string[]> => {
    try {
        return await readApprovedAccounts(request);
    } catch {
        return [];
    }
};

/**
 * Build a dapp-kit `WalletProvider` + `WalletSigner` pair that talks to
 * VeWorld's v2 API (`window.vechain.request({ method, params })`).
 *
 * The connect step uses `eth_requestAccounts` (no certificate signature),
 * mapped onto dapp-kit's internal `thor_connect` name.
 *
 * Signing operations are routed to the v2 method names directly so that
 * VeWorld does not flag them as "v1 request from v2-connected app".
 */
export const createVeWorldV2Wallet = (
    request: VeWorldRequestFn,
    genesisId: string,
): { walletSigner: WalletSigner; walletProvider: WalletProvider } => {
    const walletProvider: WalletProvider = {
        send: (async (args: VeWorldRequestArgs): Promise<unknown> => {
            switch (args.method) {
                case 'thor_methods':
                    return ADVERTISED_V2_METHODS;

                case 'thor_connect': {
                    const params = (args.params ?? {}) as {
                        value: TypedDataMessage | CertificateMessage | null;
                        external?: boolean;
                    };
                    const { value } = params;

                    if (value === null) {
                        const accounts = await readApprovedAccounts(request);
                        const signer = accounts[0];
                        if (!signer) {
                            throw new Error(
                                'VeWorld returned no account for eth_requestAccounts',
                            );
                        }
                        return { signer, accounts };
                    }

                    if ('purpose' in value) {
                        const certResponse = (await request({
                            method: 'thor_signCertificate',
                            params: [value, {}, genesisId],
                        })) as CertificateResponse;
                        const accounts =
                            await safeReadApprovedAccounts(request);
                        return { ...certResponse, accounts };
                    }

                    const signature = (await request({
                        method: 'thor_signTypedData',
                        params: {
                            domain: value.domain,
                            types: value.types,
                            value: value.value,
                            opts: {},
                            genesisId,
                        },
                    })) as string;
                    const accounts = await safeReadApprovedAccounts(request);
                    return { signer: accounts[0] ?? '', signature, accounts };
                }

                case 'thor_disconnect':
                    return request({ method: 'wallet_revokePermissions' });

                case 'wallet_revokeAccountPermission': {
                    const params = args.params as
                        | [{ eth_accounts: { addresses: string[] } }]
                        | undefined;
                    return request({
                        method: 'wallet_revokeAccountPermission',
                        params,
                    });
                }

                case 'wallet_requestPermissions': {
                    // EIP-2255 style: ALWAYS opens VeWorld's account picker,
                    // pre-selecting the already-approved accounts. Returns
                    // `string[]` (the new approved set).
                    const params = (args.params ?? [
                        { eth_accounts: {} },
                    ]) as unknown;
                    const accounts = (await request({
                        method: 'wallet_requestPermissions',
                        params,
                    } as VeWorldRequestArgs)) as string[] | string | null;
                    if (Array.isArray(accounts)) return accounts;
                    if (accounts) return [accounts];
                    return [];
                }

                case 'thor_signCertificate': {
                    const params = (args.params ?? {}) as {
                        message: CertificateMessage;
                        options?: CertificateOptions;
                    };
                    return request({
                        method: 'thor_signCertificate',
                        params: [
                            params.message,
                            params.options ?? {},
                            genesisId,
                        ],
                    });
                }

                case 'thor_signTypedData': {
                    const params = (args.params ?? {}) as {
                        domain: TypedDataDomain;
                        types: Record<string, TypedDataParameter[]>;
                        value: Record<string, unknown>;
                        options?: SignTypedDataOptions;
                    };
                    return request({
                        method: 'thor_signTypedData',
                        params: {
                            domain: params.domain,
                            types: params.types,
                            value: params.value,
                            opts: params.options,
                            genesisId,
                        },
                    });
                }

                case 'thor_sendTransaction': {
                    const params = (args.params ?? {}) as {
                        clauses: TransactionMessage[];
                        options?: TransactionOptions;
                    };
                    return request({
                        method: 'thor_sendTransaction',
                        params: [
                            params.clauses ?? [],
                            params.options ?? {},
                            genesisId,
                        ],
                    });
                }

                case 'thor_wallet':
                case 'thor_switchWallet':
                    // Not supported by VeWorld's v2 surface — let the caller
                    // fall back to cached state / hide the action.
                    return null;

                default:
                    throw new Error(
                        `VeWorld v2 adapter: unsupported method "${args.method}"`,
                    );
            }
        }) as WalletProvider['send'],
    };

    const walletSigner: WalletSigner = {
        signTx: async (msg, options) => {
            const res = (await request({
                method: 'thor_sendTransaction',
                params: [msg, options ?? {}, genesisId],
            })) as TransactionResponse;
            return res;
        },
        signCert: async (msg, options) => {
            const res = (await request({
                method: 'thor_signCertificate',
                params: [msg, options ?? {}, genesisId],
            })) as CertificateResponse;
            return res;
        },
        signTypedData: async (domain, types, message, options) => {
            const res = (await request({
                method: 'thor_signTypedData',
                params: {
                    domain,
                    types,
                    value: message,
                    opts: options,
                    genesisId,
                },
            })) as string;
            return res;
        },
    };

    return { walletSigner, walletProvider };
};
