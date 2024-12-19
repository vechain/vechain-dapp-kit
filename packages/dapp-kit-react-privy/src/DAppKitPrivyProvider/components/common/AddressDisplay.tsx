'use client';

import { Text, VStack, Icon, HStack } from '@chakra-ui/react';
import { useState } from 'react';
import { IoCopyOutline, IoCheckmarkOutline } from 'react-icons/io5';
import { humanAddress } from '../../utils';

type Props = {
    address: string;
    label?: string;
    domain?: string;
};

export const AddressDisplay = ({ address, label, domain }: Props) => {
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
                {domain ? (
                    <VStack>
                        <HStack>
                            <Text fontSize={'lg'} fontWeight={'500'}>
                                {domain}
                            </Text>
                            <Icon
                                boxSize={4}
                                aria-label="Copy Address"
                                as={copied ? IoCheckmarkOutline : IoCopyOutline}
                                cursor="pointer"
                                onClick={() => copyToClipboard(address)}
                            />
                        </HStack>
                        <Text fontSize={'xs'}>
                            {'('}
                            {humanAddress(address, 8, 7)}
                            {')'}
                        </Text>
                    </VStack>
                ) : (
                    <HStack>
                        <Text fontSize={'md'}>
                            {humanAddress(address, 6, 4)}
                        </Text>
                        <Icon
                            boxSize={3}
                            aria-label="Copy Address"
                            as={copied ? IoCheckmarkOutline : IoCopyOutline}
                            cursor="pointer"
                            onClick={() => copyToClipboard(address)}
                        />
                    </HStack>
                )}
            </VStack>
        </VStack>
    );
};
