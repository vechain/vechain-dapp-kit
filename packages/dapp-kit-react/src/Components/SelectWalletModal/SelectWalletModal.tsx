import React, { useCallback, useMemo } from 'react';
import { createComponent } from '@lit/react';
import type { SourceInfo } from '@vechainfoundation/dapp-kit-ui';
import { ConnectModal } from '@vechainfoundation/dapp-kit-ui';
import type { WalletSource } from '@vechainfoundation/dapp-kit';
import { useWallet } from '../../DAppKitProvider';

const createButtonWithModal = () =>
    createComponent({
        tagName: 'vwk-connect-modal',
        elementClass: ConnectModal,
        react: React,
    });

interface SelectWalletProps {
    onSelected?: (source: WalletSource) => void;
    isOpen: boolean;
}

/**
 * SelectWalletModal
 *
 * This component is used to select the wallet source. It will not attempt to connect to the wallet
 */
export const SelectWalletModal: React.FC<SelectWalletProps> = ({
    onSelected,
    isOpen,
}) => {
    const Modal = useMemo(() => createButtonWithModal(), []);

    const { setSource } = useWallet();

    const onSourceClick = useCallback(
        (source?: SourceInfo) => {
            if (source) {
                setSource(source.id);
                onSelected?.(source.id);
            }
        },
        [onSelected, setSource],
    );

    return <Modal onSourceClick={onSourceClick} open={isOpen} />;
};
