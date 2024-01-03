import React, { useMemo } from 'react';
import { createComponent } from '@lit/react';
import { Button as ButtonVanilla } from '@vechain/dapp-kit-ui';
import { useThemeSelector } from '../../../provider/ThemeProvider';

const VechainDappConnectKitWrapped = () =>
    createComponent({
        tagName: 'vwk-button',
        elementClass: ButtonVanilla,
        react: React,
    });

export const VechainDappConnectKitWithTheme: React.FC = () => {
    const { theme } = useThemeSelector();

    const VechainDappConnectKit = useMemo(
        () => VechainDappConnectKitWrapped(),
        [],
    );

    return <VechainDappConnectKit mode={theme.mode} />;
};
