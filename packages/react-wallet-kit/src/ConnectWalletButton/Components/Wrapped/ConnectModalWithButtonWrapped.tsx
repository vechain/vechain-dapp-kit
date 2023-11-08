import React from 'react';
import { createComponent } from '@lit/react';
import { ConnectButtonWithModal } from '@vechain/vanilla-wallet-kit';

export const ConnectModalWithButtonWrapped = createComponent({
    tagName: 'vwk-connect-button-with-modal',
    elementClass: ConnectButtonWithModal,
    react: React,
});
