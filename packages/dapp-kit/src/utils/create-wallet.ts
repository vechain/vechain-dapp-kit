import type {
    DAppKitOptions,
    RemoteWallet,
    WalletSource,
    WCClient,
    WCModal,
} from '../types';
import { CertificateBasedWallet } from '../classes/certificate-wallet';
import { WCWallet } from '../classes/wc-wallet';
import { createWcClient } from './create-wc-client';
import { createWcModal } from './create-wc-modal';
import { createWcSigner } from './create-wc-signer';
import { DAppKitLogger } from './logger';
import { createSync, createSync2 } from './sync-signers';
import { ThorClient } from '@vechain/sdk-network';
import { GetGenesisBlockFunc } from '../types/types';

type ICreateWallet = DAppKitOptions & {
    source: WalletSource;
    onDisconnected: () => void;
    thorClient: ThorClient;
};

const getGenesisBlock =
    (thorClient: ThorClient): GetGenesisBlockFunc =>
    async () => {
        const block = await thorClient.blocks.getGenesisBlock();

        if (block === null) {
            throw new Error('Failed to get genesis block');
        }

        return block;
    };

export const createWallet = ({
    source,
    walletConnectOptions,
    onDisconnected,
    connectionCertificate,
    thorClient,
}: ICreateWallet): RemoteWallet => {
    DAppKitLogger.debug('createWallet', source);

    switch (source) {
        case 'sync': {
            if (!window.connex) {
                throw new Error('User is not in a Sync wallet');
            }

            const vendor = createSync(getGenesisBlock(thorClient));

            return new CertificateBasedWallet(vendor, connectionCertificate);
        }
        case 'sync2': {
            const vendor = createSync2(getGenesisBlock(thorClient));

            return new CertificateBasedWallet(vendor, connectionCertificate);
        }
        case 'veworld': {
            if (!window.vechain) {
                throw new Error('VeWorld Extension is not installed');
            }

            const signer = getGenesisBlock(thorClient)().then(
                (genesisBlock) => {
                    return window.vechain!.newConnexSigner(genesisBlock.id);
                },
            );

            return new CertificateBasedWallet(signer, connectionCertificate);
        }
        case 'wallet-connect': {
            if (!walletConnectOptions) {
                throw new Error('WalletConnect options are not provided');
            }

            const { projectId, metadata, modal } = walletConnectOptions;

            const wcClient: WCClient = createWcClient({
                projectId,
                metadata,
            });

            const web3Modal: WCModal = modal ?? createWcModal(projectId);

            const wallet = createWcSigner({
                getGenesisBlock: getGenesisBlock(thorClient),
                wcClient,
                web3Modal,
                onDisconnected,
            });

            return new WCWallet(wallet);
        }
    }
};
