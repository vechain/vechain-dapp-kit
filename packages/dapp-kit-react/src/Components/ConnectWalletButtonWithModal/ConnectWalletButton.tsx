import type { HTMLChakraProps } from '@chakra-ui/react';
import React from 'react';
import GlobalFonts from '../../../assets/fonts/fonts';
import { ThemeProvider } from '../../provider/ThemeProvider';
import { ThemeSelector } from '../ThemeSelector';
import { ConnectButtonWithModal } from './Components/ConnectButtonWithModal';

interface ConnectWalletButtonProps {
    buttonProps?: HTMLChakraProps<'button'>;
}

export const ConnectWalletButtonWithModal: React.FC<
    ConnectWalletButtonProps
> = (): React.ReactElement => {
    return (
        <ThemeProvider>
            <GlobalFonts />
            <ThemeSelector />
            <ConnectButtonWithModal />
        </ThemeProvider>
    );
};
