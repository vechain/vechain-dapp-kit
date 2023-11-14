import { useCallback, useContext } from 'react';
import type { WalletSource } from '@vechainfoundation/dapp-kit';
import type { SourceInfo } from '@vechainfoundation/dapp-kit-ui';
import { ThemeContext } from '../../../provider/ThemeProvider';
import { useWallet } from '../../../ConnexProvider';
import { ConnectModalWithButtonWrapped } from './Wrapped/ConnectModalWithButtonWrapped';

export const ConnectButtonWithModal = () => {
    const { theme } = useContext(ThemeContext);

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
        <>
            <ConnectModalWithButtonWrapped
                mode={theme.mode}
                onSourceClick={_connect}
            />
        </>
    );
};
