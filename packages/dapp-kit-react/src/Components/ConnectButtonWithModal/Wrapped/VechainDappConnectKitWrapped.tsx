import React, { useMemo } from 'react';
import { createComponent } from '@lit/react';
import { VechainDappConnectKit as VechainDappConnectKitVanilla } from '@vechain/dapp-kit-ui';
import { useThemeSelector } from '../../../provider/ThemeProvider';

const VechainDappConnectKitWrapped = () =>
    createComponent({
        tagName: 'vwk-vechain-dapp-connect-kit',
        elementClass: VechainDappConnectKitVanilla,
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
