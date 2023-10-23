import type { HTMLChakraProps} from "@chakra-ui/react";
import { Image, useColorModeValue } from "@chakra-ui/react";
import React from "react";

type IIMage = HTMLChakraProps<"img">;

export const VechainLogo: React.FC<IIMage> = ({
  ...props
}): React.ReactElement => {
  const lightModeUrl = `${process.env.PUBLIC_URL}/images/logo/vechain.png`;
  const darkModeUrl = `${process.env.PUBLIC_URL}/images/logo/vechain_white.png`;
  const logoUrl = useColorModeValue(lightModeUrl, darkModeUrl);
  return (
    <Image
      alt="Vechain logo"
      h="full"
      objectFit="cover"
      src={logoUrl}
      {...props}
    />
  );
};

export const VeWorldLogo: React.FC<IIMage> = ({ ...props }) => {
  const lightModeUrl = `${process.env.PUBLIC_URL}/images/logo/veWorld.png`;
  const darkModeUrl = `${process.env.PUBLIC_URL}/images/logo/veworld_black.png`;
  const logoUrl = useColorModeValue(lightModeUrl, darkModeUrl);
  return (
    <Image
      alt="VeWorld logo"
      h="full"
      objectFit="cover"
      src={logoUrl}
      {...props}
    />
  );
};
