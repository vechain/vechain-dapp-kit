import { newWcSigner } from './signer';
import { newWeb3Modal } from './web3-modal';
import { newWcClient } from './client';

export type {
    WCSigner,
    WCSignerOptions,
    WalletConnectOptions,
    ResolvedSignClient,
    WCClient,
    WCModal,
} from './types';

export { newWcSigner, newWeb3Modal, newWcClient };
