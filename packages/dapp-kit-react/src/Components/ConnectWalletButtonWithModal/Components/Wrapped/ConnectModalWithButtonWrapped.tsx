import React from 'react';
import { createComponent } from '@lit/react';
import { ConnectButtonWithModal } from '@vechain/dapp-kit-ui';

export const createButtonWithModal = () =>
    createComponent({
        tagName: 'vwk-connect-button-with-modal',
        elementClass: ConnectButtonWithModal,
        react: React,
    });
