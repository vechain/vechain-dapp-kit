import type { HTMLChakraProps } from "@chakra-ui/react";
import { Button, HStack, Icon, Text, useClipboard } from "@chakra-ui/react";
import { CheckIcon, DocumentDuplicateIcon } from "@heroicons/react/24/solid";
import React, { useCallback, useEffect } from "react";
import { friendlyAddress } from "../Utils/AccountUtils";
import { AddressIcon } from "./AddressIcon";

interface AddressButtonProps extends HTMLChakraProps<"button"> {
  address: string;
  showAddressIcon?: boolean;
  showCopyIcon?: boolean;
}

export const AddressButton: React.FC<AddressButtonProps> = ({
  address,
  showAddressIcon = true,
  showCopyIcon = true,
  ...props
}) => {
  const { onCopy, hasCopied, setValue } = useClipboard(address);

  const { onClick, ...otherProps } = props;

  const onClickHandler = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>): void => {
      // console.log(onClick)
      if (onClick) onClick(e);
      if (showCopyIcon) onCopy();
    },
    [onClick, showCopyIcon, onCopy]
  );

  useEffect(() => {
    setValue(address);
  }, [setValue, address]);

  return (
    <Button
      colorScheme="gray"
      onClick={onClickHandler}
      {...(showAddressIcon && { paddingLeft: 0 })}
      paddingY={0}
      variant="outline"
      {...otherProps}
    >
      <HStack h="full" justify="flex-start" roundedLeft="md" spacing={4}>
        {showAddressIcon ? (
          <AddressIcon address={address} roundedLeft="md" />
        ) : null}
        <Text fontSize="md">{friendlyAddress(address)}</Text>
        {showCopyIcon ? (
          <Icon
            aria-label="Copy Address"
            as={hasCopied ? CheckIcon : DocumentDuplicateIcon}
          />
        ) : null}
      </HStack>
    </Button>
  );
};
