import React, { useMemo } from 'react';
import { createComponent } from '@lit/react';
import { ConnectModal } from '@vechainfoundation/dapp-kit-ui';

export const createButtonWithModal = () =>
    createComponent({
        tagName: 'vwk-connect-modal',
        elementClass: ConnectModal,
        react: React,
    });

export const ConnectWalletModal: React.FC = () => {
    const Modal = useMemo(() => createButtonWithModal(), []);

    return <Modal />;
};
