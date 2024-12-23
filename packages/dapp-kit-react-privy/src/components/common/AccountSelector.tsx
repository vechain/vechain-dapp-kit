'use client';

import { Text, Icon, HStack, Button, useColorMode } from '@chakra-ui/react';
import { humanAddress } from '../../utils';
import { Wallet } from '../../hooks';
import { IoIosArrowDown } from 'react-icons/io';
import { useState } from 'react';
import { IoCheckmarkOutline, IoCopyOutline } from 'react-icons/io5';

type Props = {
    wallet: Wallet;
    size?: string;
    onClick?: () => void;
};

export const AccountSelector = ({ wallet, size = 'md', onClick }: Props) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    const [copied, setCopied] = useState(false);

    const copyToClipboard = async (textToCopy: string) => {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <Button
            w="fit-content"
            h="fit-content"
            p={2}
            px={4}
            onClick={onClick}
            bg="transparent"
            border={`1px solid ${isDark ? '#ffffff29' : '#ebebeb'}`}
            _hover={{
                borderColor: isDark ? '#ffffff50' : '#dedede',
                bg: isDark ? 'whiteAlpha.50' : 'blackAlpha.50',
            }}
            _active={{
                transform: 'scale(0.98)',
            }}
            transition="all 0.2s"
        >
            <HStack spacing={4} align="center">
                <Icon
                    boxSize={5}
                    as={copied ? IoCheckmarkOutline : IoCopyOutline}
                    cursor="pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        copyToClipboard(wallet.address);
                    }}
                />
                <Text fontSize={size} fontWeight="500">
                    {wallet.domain || humanAddress(wallet.address, 6, 4)}
                </Text>

                <Icon boxSize={5} as={IoIosArrowDown} cursor="pointer" />
            </HStack>
        </Button>
    );
};
