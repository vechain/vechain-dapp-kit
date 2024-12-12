import type { SignClientTypes } from '@walletconnect/types';
import type { SignClient } from '@walletconnect/sign-client';
import type { ConnectResponse, WalletSigner } from './types';

export type ResolvedSignClient = Awaited<ReturnType<typeof SignClient.init>>;

/**
 * WCSigner is a {@link WalletSigner} with an additional disconnect method
 *
 */
export type WCSigner = WalletSigner & {
    /**
     * Disconnects and cleans up the WalletConnect session
     */
    disconnect: () => Promise<void>;

    /**
     * Connects to the Wallet and return the account address
     */
    connect: () => Promise<ConnectResponse>;
};

export interface WCClient {
    /**
     * Gets the initialized WalletConnect SignClient
     */
    get: () => Promise<ResolvedSignClient>;
}

/**
 * WCModal is a modal that can be used to display a WalletConnect QR code/ URI
 * @param openModal - A function to open the modal
 * @param closeModal - A function to close the modal
 * @param subscribeModal - A function to subscribe to modal state changes
 */
export interface WCModal {
    openModal: (options: OpenOptions) => Promise<void>;
    closeModal: () => void;
    subscribeModal: (
        callback: (newState: SubscribeModalState) => void,
    ) => () => void;
    askForConnectionCertificate?: () => void;
    onConnectionCertificateSigned?: () => void;
}

/**
 * Options for the createWcClient function
 * @param projectId - Your WalletConnect project ID
 * @param relayUrl - The URL of your WalletConnect relay server
 * @param metadata - The metadata of your WalletConnect dApp
 * @param logger - The logger or log level to use
 * @param modal - {@link WCModal} can be used to provide a custom modal
 */
export interface WalletConnectOptions {
    projectId: string;
    metadata: SignClientTypes.Options['metadata'];
    modal?: WCModal;
}

/**
 * Options for the {@link WCModal}
 * @param open - Whether the modal is open
 */
export interface SubscribeModalState {
    open: boolean;
}

/**
 * Options for opening the {@link WCModal}
 * @param uri - The WalletConnect URI to display / open
 */
export interface OpenOptions {
    uri: string;
}

/**
 * Options for the {@link WCSigner}
 * @param wcClient - See {@link WCClient}
 * @param web3Modal - See {@link WCModal}
 * @param onDisconnected - (optional) A callback that will be called when the session is disconnected
 * @param genesisId - The genesis ID of the VeChain network you want to connect to
 */
export interface WCSignerOptions {
    wcClient: WCClient;
    web3Modal: WCModal;
    onDisconnected: () => void;
    genesisId: Promise<string>;
}
