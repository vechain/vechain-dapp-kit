'use client';

import { Text, VStack, Icon, HStack } from '@chakra-ui/react';
import { useState } from 'react';
import { IoCopyOutline, IoCheckmarkOutline } from 'react-icons/io5';
import { humanAddress } from '../../utils';
import { Wallet } from '../../hooks';

type Props = {
    wallet: Wallet;
    label?: string;
    size?: string;
};

export const AddressDisplay = ({ wallet, label, size = 'lg' }: Props) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async (textToCopy: string) => {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <VStack w={'full'} justifyContent={'center'}>
            <VStack>
                {label && (
                    <Text fontSize={'sm'} opacity={0.7}>
                        {label}
                    </Text>
                )}
                {wallet.domain ? (
                    <VStack>
                        <HStack>
                            <Text fontSize={size} fontWeight={'500'}>
                                {wallet.domain}
                            </Text>
                            <Icon
                                boxSize={4}
                                aria-label="Copy Address"
                                as={copied ? IoCheckmarkOutline : IoCopyOutline}
                                cursor="pointer"
                                onClick={() => copyToClipboard(wallet.address)}
                            />
                        </HStack>
                        <Text fontSize={'sm'}>
                            {'('}
                            {humanAddress(wallet.address, 8, 7)}
                            {')'}
                        </Text>
                    </VStack>
                ) : (
                    <HStack>
                        <Text fontSize={size}>
                            {humanAddress(wallet.address, 6, 4)}
                        </Text>
                        <Icon
                            boxSize={3}
                            aria-label="Copy Address"
                            as={copied ? IoCheckmarkOutline : IoCopyOutline}
                            cursor="pointer"
                            onClick={() => copyToClipboard(wallet.address)}
                        />
                    </HStack>
                )}
            </VStack>
        </VStack>
    );
};
