import React from 'react';
import { Button as ButtonVanilla } from '@vechain/dapp-kit-ui';
import { createComponent } from '@lit/react';

export const VwkButton = createComponent({
    tagName: 'vwk-button',
    elementClass: ButtonVanilla,
    react: React,
});
