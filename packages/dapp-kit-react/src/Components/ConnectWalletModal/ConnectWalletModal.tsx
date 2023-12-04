import React, { useCallback, useMemo } from 'react';
import { createComponent } from '@lit/react';
import type { SourceInfo } from '@vechainfoundation/dapp-kit-ui';
import { ConnectModal } from '@vechainfoundation/dapp-kit-ui';
import type { ConnectResponse } from '@vechainfoundation/dapp-kit';
import { useWallet } from '../../DAppKitProvider';

const createButtonWithModal = () =>
    createComponent({
        tagName: 'vwk-connect-modal',
        elementClass: ConnectModal,
        react: React,
    });

interface ConnectWalletProps {
    onConnectError?: (err: unknown) => void;
    onConnected?: (res: ConnectResponse) => void;
    isOpen: boolean;
}

/**
 * ConnectWalletModal
 *
 * This component allows the user to select a wallet and then connect. The account address should be available after the connection is successful.
 */

export const ConnectWalletModal: React.FC<ConnectWalletProps> = ({
    onConnectError,
    onConnected,
    isOpen,
}) => {
    const Modal = useMemo(() => createButtonWithModal(), []);

    const { setSource, connect } = useWallet();

    const onSourceClick = useCallback(
        (source?: SourceInfo) => {
            if (source) {
                setSource(source.id);
                connect().then(onConnected).catch(onConnectError);
            }
        },
        [onConnectError, onConnected, connect, setSource],
    );

    return <Modal onSourceClick={onSourceClick} open={isOpen} />;
};
