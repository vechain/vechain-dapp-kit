import React from 'react';
import { Button as ButtonVanilla } from '@vechain/dapp-kit-ui';
import { createComponent } from '@lit/react';

export const WalletButton = createComponent({
    tagName: 'vdk-button',
    elementClass: ButtonVanilla,
    react: React,
});
