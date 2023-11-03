import type { HTMLChakraProps } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/react';
import { styled } from 'styled-components';
import { WalletIcon } from '@heroicons/react/24/solid';
import React from 'react';
import { WalletModal } from './Components/WalletModal';
import { useDisclosure } from '../hooks/useDisclosure';

import GlobalFonts from '../../assets/fonts/fonts';
import { ThemeSelector } from './Components/ThemeSelector';
import { ThemeProvider } from '../provider/ThemeProvider';

interface ConnectWalletButtonProps {
    buttonProps?: HTMLChakraProps<'button'>;
}

const Button = styled.button`
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    font-family: 'Inter';
    font-weight: 500;
    border-radius: 12px;
    color: ${(props) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return props.theme.textColor;
    }};
    background-color: ${(props) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return props.theme.backgroundColor;
    }};
`;

export const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({
    buttonProps,
}): React.ReactElement => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <ThemeProvider>
            <GlobalFonts />
            <WalletModal show={isOpen} handleClose={onClose} />
            <ThemeSelector />
            <Button
                {...buttonProps}
                leftIcon={<Icon as={WalletIcon} />}
                onClick={onOpen}
            >
                Connect Wallet
            </Button>
        </ThemeProvider>
    );
};
