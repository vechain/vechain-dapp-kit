import type { HTMLChakraProps } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/react';
import styled from 'styled-components';
import { WalletIcon } from '@heroicons/react/24/solid';
import React from 'react';
import { WalletModal } from './Components/WalletModal';
import { useDisclosure } from '../hooks/useDisclosure';

import GlobalFonts from '../../assets/fonts/fonts';

interface ConnectWalletButtonProps {
    buttonProps?: HTMLChakraProps<'button'>;
}

const Button = styled.button`
    background-color: #0074d9;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    font-family: 'Inter';
    font-weight: 500;
    border-radius: 12px;
    color: #fff;
`;

export const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({
    buttonProps,
}): React.ReactElement => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            <GlobalFonts />
            <WalletModal show={isOpen} handleClose={onClose} />
            <Button
                {...buttonProps}
                leftIcon={<Icon as={WalletIcon} />}
                onClick={onOpen}
            >
                Connect Wallet
            </Button>
        </>
    );
};
