import type { HTMLChakraProps } from '@chakra-ui/react';
import { Button, Icon, useDisclosure } from '@chakra-ui/react';
import { WalletIcon } from '@heroicons/react/24/solid';
import React from 'react';
import { ConnectWalletModal } from './Components/ConnectWalletModal';

interface ConnectWalletButtonProps {
    buttonProps?: HTMLChakraProps<'button'>;
}

export const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({
    buttonProps,
}): React.ReactElement => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            <ConnectWalletModal isOpen={isOpen} onClose={onClose} />
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
