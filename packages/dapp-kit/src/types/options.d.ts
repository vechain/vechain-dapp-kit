import type { CertificateArgs, WalletSource } from './types';
import { type WalletConnectOptions } from './wc-types';

/**
 * Options for the DAppKit class
 */
export interface DAppKitOptions {
    /**
     * The URL of the Node, or the {@link HttpClient} instance
     */
    node: string | HttpClient;
    /**
     * Options for the WalletConnect integration
     */
    walletConnectOptions?: WalletConnectOptions;
    /**
     * Whether to persist the wallet source/ account
     * @default false
     */
    usePersistence?: boolean;
    /**
     * Whether to use the first detected wallet source.
     * @default false
     */
    useFirstDetectedSource?: boolean;
    /**
     * The log level to use for the DAppKitUI logger
     * @default LogLevel.NONE
     */
    logLevel?: LogLevel;
    /**
     * Whether to require a connection certificate
     * @default true
     */
    requireCertificate?: boolean;
    /**
     * Options for the connection certificate
     */
    connectionCertificate?: CertificateArgs;
    /**
     * An array of wallet sources to allow
     */
    allowedWallets?: WalletSource[];
    /**
     * V2 APIs
     */
    v2Api: {
        /**
         * Whether to support the new methods.
         * @default false
         */
        enabled?: boolean;
        /**
         * Whether the dapp uses external authentication
         * @default false
         */
        external?: boolean;
    };

    /**
     * ID of the genesis block. It is the `id` property of the block #0, <node>/blocks/0 is the HTTP call to perform.
     */
    genesisId: string;
}
