import { styled } from 'styled-components';
import { SYNC_LOGO } from '../../../assets/img/sync';
import { SYNC2_LOGO } from '../../../assets/img/sync2';
import { WalletButton } from './WalletButton';
import { VEWORLD_LOGO } from '../../../assets/img/veWorld';

interface Wallet {
    walletName: string;
    walletImageUrl: string;
}

const WalletsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const wallets: Wallet[] = [
    {
        walletName: 'VeWorld',
        walletImageUrl: VEWORLD_LOGO,
    },
    {
        walletName: 'Sync',
        walletImageUrl: SYNC_LOGO,
    },
    {
        walletName: 'Sync2',
        walletImageUrl: SYNC2_LOGO,
    },
];

const WalletList = () => {
    return (
        <WalletsContainer>
            {wallets.map((wallet) => {
                return (
                    <WalletButton
                        key={wallet.walletName}
                        walletName={wallet.walletName}
                        walletImageUrl={wallet.walletImageUrl}
                    />
                );
            })}
        </WalletsContainer>
    );
};

export { WalletList };
