import 'react';
import { ConnectModalWithButtonWrapped } from './Wrapped/ConnectModalWithButtonWrapped';
import { useCallback, useContext, useState } from 'react';
import { ThemeContext } from '../../provider/ThemeProvider';
import { WalletSource } from '@vechain/wallet-kit';
import { useWallet } from '../../ConnexProvider';
import { SourceInfo } from '@vechain/vanilla-wallet-kit';

interface ConnectButtonWithModalProps {
    onClose?: () => void;
}
export const ConnectButtonWithModal = ({
    onClose,
}: ConnectButtonWithModalProps) => {
    const { theme } = useContext(ThemeContext);

    const handleSourceClick = (e: SourceInfo) => {
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
