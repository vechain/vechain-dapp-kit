import { newWcSigner } from './signer';
import { createWcModal } from './web3-modal';
import { createWcClient } from './client';

export type {
    WCSigner,
    WCSignerOptions,
    WalletConnectOptions,
    ResolvedSignClient,
    WCClient,
    WCModal,
    OpenOptions,
    SubscribeModalState,
} from './types';

export { newWcSigner, createWcModal, createWcClient };
