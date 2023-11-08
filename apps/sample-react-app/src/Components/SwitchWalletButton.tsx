import type { HTMLChakraProps } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import React from 'react';
import {
    ConnectWalletButton,
    useWallet,
} from '@vechainfoundation/react-wallet-kit';
import { AccountDetailModal } from './AccountDetailModal';
import { AddressButton } from './AddressButton';

interface SwitchWalletButtonProps {
    buttonProps?: HTMLChakraProps<'button'>;
}

export const SwitchWalletButton: React.FC<SwitchWalletButtonProps> = ({
    buttonProps,
}): React.ReactElement => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { account, source } = useWallet();

    if (account && source)
        return (
            <>
                <AccountDetailModal
                    address={account}
                    isOpen={isOpen}
                    onClose={onClose}
                    source={source}
                />
                <AddressButton
                    {...buttonProps}
                    address={account}
                    onClick={onOpen}
                    showCopyIcon={false}
                />
            </>
        );

    return <ConnectWalletButton buttonProps={buttonProps} />;
};
