import { Button, HStack, Image, Text, VStack } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import type { WalletSource } from '@vechain/wallet-kit';
import { WalletSources } from '../Constants';
import { AddressButton } from './AddressButton';

interface AccountDetailBodyProps {
    accountAddress: string;
    source: WalletSource;
    disconnectWallet: () => void;
}

export const AccountDetailBody: React.FC<AccountDetailBodyProps> = ({
    accountAddress,
    source,
    disconnectWallet
}) => {
    const sourceInfo = useMemo(() => WalletSources[source], [source]);

    return (
        <>
            <VStack spacing={4} w="100%">
                <HStack justifyContent="space-between" w="full">
                    <Text as="b" fontSize="md">
                        Account
                    </Text>
                    <AddressButton address={accountAddress} />
                </HStack>
                <HStack justifyContent="space-between" w="full">
                    <Text as="b" fontSize="md">
                        Source
                    </Text>
                    <HStack spacing={2}>
                        <Image
                            alt={`${sourceInfo.name}-logo`}
                            h={35}
                            objectFit="cover"
                            src={sourceInfo.logo}
                            w={35}
                        />
                        <Text>{sourceInfo.name}</Text>
                    </HStack>
                </HStack>
            </VStack>
            <Button
                colorScheme="red"
                mt={8}
                onClick={disconnectWallet}
                w="full"
            >
                Disconnect
            </Button>
        </>
    );
};
