import React from 'react';
import GlobalFonts from '../../../assets/fonts/fonts';
import { ThemeProvider } from '../../provider/ThemeProvider';
import { VechainDappConnectKitWithTheme } from './Wrapped/VechainDappConnectKitWrapped';

export const VechainDappConnectKit: React.FC = (): React.ReactElement => {
    return (
        <ThemeProvider>
            <GlobalFonts />
            <VechainDappConnectKitWithTheme />
        </ThemeProvider>
    );
};
