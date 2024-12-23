'use client';

import { Text, Icon, HStack, Button } from '@chakra-ui/react';
import { humanAddress } from '../../../utils';
import { Wallet } from '../../../hooks';
import { IoIosArrowDown } from 'react-icons/io';
import { useState } from 'react';
import { IoCheckmarkOutline, IoCopyOutline } from 'react-icons/io5';

type Props = {
    wallet: Wallet;
    size?: string;
    onClick?: () => void;
};

export const AccountSelector = ({ wallet, size = 'md', onClick }: Props) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async (textToCopy: string) => {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <HStack>
            <Button
                w="fit-content"
                h="fit-content"
                p={2}
                px={4}
                onClick={onClick}
                variant="selector"
            >
                <HStack spacing={4} align="center">
                    <Text fontSize={size} fontWeight="500">
                        {wallet.domain || humanAddress(wallet.address, 6, 4)}
                    </Text>

                    <Icon boxSize={5} as={IoIosArrowDown} cursor="pointer" />
                </HStack>
            </Button>

            <Button
                p={2}
                px={4}
                variant="selector"
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    copyToClipboard(wallet.address);
                }}
            >
                <Icon
                    boxSize={5}
                    as={copied ? IoCheckmarkOutline : IoCopyOutline}
                />
            </Button>
        </HStack>
    );
};
