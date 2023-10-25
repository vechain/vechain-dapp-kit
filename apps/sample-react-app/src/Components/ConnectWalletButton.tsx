import type { HTMLChakraProps } from "@chakra-ui/react";
import { Button, Icon, useDisclosure } from "@chakra-ui/react";
import { WalletIcon } from "@heroicons/react/24/solid";
import React from "react";
import { useWallet } from "@vechain/react-wallet-kit";
import { AccountDetailModal } from "./AccountDetailModal";
import { AddressButton } from "./AddressButton";
import { ConnectWalletModal } from "./ConnectWalletModal";

interface ConnectWalletButtonProps {
  buttonProps?: HTMLChakraProps<"button">;
}

export const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({
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

  return (
    <>
      <ConnectWalletModal isOpen={isOpen} onClose={onClose} />
      <Button
        {...buttonProps}
        leftIcon={<Icon as={WalletIcon} />}
        onClick={onOpen}
      >
        Connect Wallet
      </Button>
    </>
  );
};
