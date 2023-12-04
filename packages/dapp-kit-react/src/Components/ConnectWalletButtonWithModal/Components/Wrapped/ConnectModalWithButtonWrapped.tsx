import React from 'react';
import { createComponent } from '@lit/react';
import { VechainDappConnectKit } from '@vechainfoundation/dapp-kit-ui';

export const createButtonWithModal = () =>
    createComponent({
        tagName: 'vwk-vechain-dapp-connect-kit',
        elementClass: VechainDappConnectKit,
        react: React,
    });
