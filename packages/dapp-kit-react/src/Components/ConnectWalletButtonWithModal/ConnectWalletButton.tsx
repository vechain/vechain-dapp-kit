import React from 'react';
import GlobalFonts from '../../../assets/fonts/fonts';
import { ThemeProvider } from '../../provider/ThemeProvider';
import { ConnectButtonWithModal } from './Components/ConnectButtonWithModal';

export const ConnectWalletButtonWithModal: React.FC =
    (): React.ReactElement => {
        return (
            <ThemeProvider>
                <GlobalFonts />
                <ConnectButtonWithModal />
            </ThemeProvider>
        );
    };
