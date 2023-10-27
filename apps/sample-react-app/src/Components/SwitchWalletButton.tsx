import type { HTMLChakraProps } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import React from 'react';
import { ConnectWalletButton, useWallet } from '@vechain/react-wallet-kit';
import { AccountDetailModal } from './AccountDetailModal';
import { AddressButton } from './AddressButton';

interface SwitchWalletButtonProps {
    buttonProps?: HTMLChakraProps<'button'>;
}

export const SwitchWalletButton: React.FC<SwitchWalletButtonProps> = ({
    buttonProps,
}): React.ReactElement => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const {
        accountState: { address, source },
    } = useWallet();

    if (address && source)
        return (
            <>
                <AccountDetailModal
                    address={address}
                    isOpen={isOpen}
                    onClose={onClose}
                    source={source}
                />
                <AddressButton
                    {...buttonProps}
                    address={address}
                    onClick={onOpen}
                    showCopyIcon={false}
                />
            </>
        );

    return <ConnectWalletButton buttonProps={buttonProps} />;
};
