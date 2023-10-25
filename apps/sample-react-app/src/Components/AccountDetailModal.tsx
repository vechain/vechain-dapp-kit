import { HStack, Text } from '@chakra-ui/react';
import type { WalletSource } from '@vechain/wallet-kit';
import { useWallet } from '@vechain/react-wallet-kit';
import React, { useCallback } from 'react';
import { getPicassoImgSrc } from '../Utils/AccountUtils';
import { Dialog } from './shared';
import { AccountDetailBody } from './AccountDetailBody';

interface AccountDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    address: string;
    source: WalletSource;
}

export const AccountDetailModal: React.FC<AccountDetailModalProps> = ({
    isOpen,
    onClose,
    address,
    source
}) => {
    const { disconnect } = useWallet();

    const disconnectWallet = useCallback((): void => {
        disconnect();
        onClose();
    }, [disconnect, onClose]);

    const header = (
        <HStack
            bgImage={`url(${getPicassoImgSrc(address, true)})`}
            bgRepeat="no-repeat"
            bgSize="cover"
            p={4}
            spacing={2}
        >
            <Text color="white">Connected Wallet</Text>
        </HStack>
    );

    return (
        <Dialog
            body={
                <AccountDetailBody
                    accountAddress={address}
                    disconnectWallet={disconnectWallet}
                    source={source}
                />
            }
            closeButtonStyle={{ color: 'white' }}
            header={header}
            headerStyle={{ p: 0 }}
            isOpen={isOpen}
            onClose={onClose}
        />
    );
};
