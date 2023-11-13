import React, { useCallback } from 'react';
import type { WalletSource } from '@vechainfoundation/wallet-kit';
import type { SourceInfo } from '@vechainfoundation/vanilla-wallet-kit';
import { ConnectModal } from '@vechainfoundation/vanilla-wallet-kit';
import { createComponent } from '@lit/react';
import GlobalFonts from '../../../assets/fonts/fonts';
import { ThemeProvider } from '../../provider/ThemeProvider';
import { ThemeSelector } from '../ThemeSelector';
import { useWallet } from '../../ConnexProvider';

export const ConnectModalWrapped = createComponent({
    tagName: 'vwk-connect-modal',
    elementClass: ConnectModal,
    react: React,
});

export const ConnectWalletModal: React.FC = (): React.ReactElement => {
    const { setSource, connect, setAccount } = useWallet();

    const connectHandler = useCallback(
        async (source: WalletSource) => {
            setSource(source);

            const { account } = await connect();

            setAccount(account);
        },
        [connect, setAccount, setSource],
    );

    const _connect = useCallback(
        (source?: SourceInfo) => {
            if (source) {
                connectHandler(source.id).catch(() => {
                    // do nothing
                });
            }
        },
        [connectHandler],
    );

    return (
        <ThemeProvider>
            <GlobalFonts />
            <ConnectModalWrapped onSourceClick={_connect} open={false} />
            <ThemeSelector />
        </ThemeProvider>
    );
};
