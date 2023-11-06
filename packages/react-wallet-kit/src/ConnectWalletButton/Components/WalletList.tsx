import { styled } from 'styled-components';
import { SYNC_LOGO } from '../../../assets/img/sync';
import { SYNC2_LOGO } from '../../../assets/img/sync2';
import { WalletButton } from './WalletButton';
import { VEWORLD_LOGO } from '../../../assets/img/veWorld';
import { useConnex, useWallet } from '../../ConnexProvider';
import { useCallback } from 'react';
import { WalletSource } from '@vechain/wallet-kit';
import { Certificate } from 'thor-devkit';
import { WALLET_CONNECT_LOGO } from '../../../assets/img/wallet-connect';

interface Wallet {
    walletName: string;
    walletImageUrl: string;
    source: WalletSource;
}

const WalletsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const walletList: Wallet[] = [
    {
        walletName: 'WalletConnect',
        walletImageUrl: WALLET_CONNECT_LOGO,
        source: 'wallet-connect',
    },
    {
        walletName: 'VeWorld',
        walletImageUrl: VEWORLD_LOGO,
        source: 'veworld-extension',
    },
    {
        walletName: 'Sync',
        walletImageUrl: SYNC_LOGO,
        source: 'sync',
    },
    {
        walletName: 'Sync2',
        walletImageUrl: SYNC2_LOGO,
        source: 'sync2',
    },
];

const WalletList = () => {
    const { setSource, setAccount } = useWallet();

    const { vendor } = useConnex();

    const connectToWalletHandler =
        useCallback(async (): Promise<Certificate> => {
            const message: Connex.Vendor.CertMessage = {
                purpose: 'identification',
                payload: {
                    type: 'text',
                    content: 'Sign a certificate to prove your identity',
                },
            };

            if (!vendor) throw new Error('Vendor not available');

            const certResponse = await vendor.sign('cert', message).request();

            const cert: Certificate = {
                purpose: message.purpose,
                payload: message.payload,
                domain: certResponse.annex.domain,
                timestamp: certResponse.annex.timestamp,
                signer: certResponse.annex.signer,
                signature: certResponse.signature,
            };

            Certificate.verify(cert);

            return cert;
        }, [vendor]);

    const onSuccessfullConnection = useCallback(
        (cert: Certificate): void => {
            setAccount(cert.signer);
        },
        [setAccount],
    );

    const connectHandler = useCallback(
        async (source: WalletSource) => {
            setSource(source);

            const cert = await connectToWalletHandler();

            onSuccessfullConnection(cert);
        },
        [onSuccessfullConnection, connectToWalletHandler, setSource],
    );

    const connect = useCallback(
        (source: WalletSource) => {
            connectHandler(source).catch((e) => {
                throw e;
            });
        },
        [connectHandler],
    );

    const startConnection = useCallback(
        (source: WalletSource) => () => {
            connect(source);
        },
        [connect],
    );

    return (
        <WalletsContainer>
            {walletList.map((wallet) => {
                return (
                    <WalletButton
                        key={wallet.walletName}
                        walletName={wallet.walletName}
                        walletImageUrl={wallet.walletImageUrl}
                        onClick={startConnection(wallet.source)}
                    />
                );
            })}
        </WalletsContainer>
    );
};

export { WalletList };
