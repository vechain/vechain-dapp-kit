import { HStack, Image, Text, VStack } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import type { WalletSource } from '@vechain/wallet-kit';
import { useWallet } from '../../ConnexProvider';
import { WalletSources } from '../Constants';
import { RadioCard } from './RadioCard';

export const WalletSourceRadio: React.FC = () => {
    const { availableWallets, setSource, source } = useWallet();

    const handleSourceClick = useCallback(
        (_source: WalletSource) => () => {
            setSource(_source);
        },
        [setSource],
    );

    return (
        <VStack spacing={4} w="full">
            {availableWallets.map((_source: WalletSource) => {
                const isSelected = _source === source;

                return (
                    <WalletSourceButton
                        isSelected={isSelected}
                        key={_source}
                        onClick={handleSourceClick(_source)}
                        source={_source}
                    />
                );
            })}
        </VStack>
    );
};

interface WalletSourceButtonProps {
    source: WalletSource;
    isSelected: boolean;
    onClick: () => void;
}

const WalletSourceButton: React.FC<WalletSourceButtonProps> = ({
    source,
    isSelected,
    onClick,
}) => {
    const sourceInfo = WalletSources[source];
    return (
        <RadioCard onClick={onClick} position="relative" selected={isSelected}>
            <HStack spacing={2}>
                <Image
                    alt={`${sourceInfo.name}-logo`}
                    h={35}
                    objectFit="cover"
                    rounded="lg"
                    src={sourceInfo.logo}
                    w={35}
                />
                <Text color="primary">{sourceInfo.name}</Text>
            </HStack>
        </RadioCard>
    );
};
