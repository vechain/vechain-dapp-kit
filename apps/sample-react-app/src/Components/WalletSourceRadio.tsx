import {
  Box,
  Flex,
  HStack,
  Icon,
  Image,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import React, { useCallback } from "react";
import type { WalletSource } from "@vechain/wallet-kit";
import { useWallet } from "@vechain/react-wallet-kit";
import { WalletSources } from "../Constants";
import { RadioCard } from "./shared";

export const WalletSourceRadio: React.FC = () => {
  const { availableWallets, wallets, setSource, accountState } = useWallet();

  const handleSourceClick = useCallback(
    (isDisabled: boolean, source: WalletSource) => () => {
      if (!isDisabled) {
        setSource(source);
      }
    },
    [setSource]
  );

  return (
    <VStack spacing={4} w="full">
      {wallets.map((source: WalletSource) => {
        const isDisabled = !availableWallets.includes(source);
        const isSelected = source === accountState.source;

        return (
          <WalletSourceButton
            isDisabled={isDisabled}
            isSelected={isSelected}
            key={source}
            onClick={handleSourceClick(isDisabled, source)}
            source={source}
          />
        );
      })}
    </VStack>
  );
};

interface WalletSourceButtonProps {
  source: WalletSource;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

const WalletSourceButton: React.FC<WalletSourceButtonProps> = ({
  source,
  isSelected,
  isDisabled,
  onClick,
}) => {
  const sourceInfo = WalletSources[source];
  return (
    <RadioCard
      disabled={isDisabled}
      onClick={onClick}
      position="relative"
      selected={isSelected}
    >
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
      {isDisabled ? (
        <Box position="absolute" right={-2} top={-2} zIndex={10}>
          <SourceNotDetectedIcon source={source} />
        </Box>
      ) : null}
    </RadioCard>
  );
};

interface SourceNotDetectedIconProps {
  source: WalletSource;
}

const SourceNotDetectedIcon: React.FC<SourceNotDetectedIconProps> = ({
  source,
}) => {
  const sourceInfo = WalletSources[source];

  return (
    <Tooltip label={`${sourceInfo.name} not detected`} placement="top">
      <Flex alignItems="center" bg="orange.500" p={1} rounded="full">
        <Icon as={ExclamationTriangleIcon} color="white" fontSize="md" />
      </Flex>
    </Tooltip>
  );
};
