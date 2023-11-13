import { useCallback, useContext, useState } from 'react';
import type { WalletSource } from '@vechainfoundation/wallet-kit';
import type { SourceInfo } from '@vechainfoundation/vanilla-wallet-kit';
import { ThemeContext } from '../../../provider/ThemeProvider';
import { useWallet } from '../../../ConnexProvider';
import { ConnectModalWithButtonWrapped } from './Wrapped/ConnectModalWithButtonWrapped';

interface ConnectButtonWithModalProps {
    onClose?: () => void;
}

export const ConnectButtonWithModal = ({
    onClose,
}: ConnectButtonWithModalProps) => {
    const { theme } = useContext(ThemeContext);

    const handleSourceClick = (e: SourceInfo): void => {
        _connect(e.id);
    };

    const { setAccount, connect, setSource } = useWallet();

    const [connectionLoading, setConnectionLoading] = useState(false);
    const [connectionError, setConnectionError] = useState('');

    const connectHandler = useCallback(
        async (source: WalletSource) => {
            try {
                setSource(source);
                setConnectionError('');
                setConnectionLoading(true);

                const { account } = await connect();
                setAccount(account);

                onClose?.();
            } catch (e) {
                if (e instanceof Error) {
                    setConnectionError(e.message);
                } else {
                    setConnectionError('Failed to connect to wallet');
                }
            } finally {
                setConnectionLoading(false);
            }
        },
        [
            connect,
            onClose,
            setAccount,
            setConnectionError,
            setConnectionLoading,
            setSource,
        ],
    );

    const _connect = useCallback(
        (source: WalletSource) => {
            connectHandler(source).catch(() => {
                // do nothing
            });
        },
        [connectHandler],
    );

    return (
        <>
            <ConnectModalWithButtonWrapped
                mode={theme.mode}
                onSourceClick={handleSourceClick}
            />
            {connectionError}
            {connectionLoading}
        </>
    );
};
