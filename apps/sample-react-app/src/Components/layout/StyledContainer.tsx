import { Box, Container, useColorModeValue } from "@chakra-ui/react";
import React from "react";

interface StyledContainerProps {
  children: React.ReactNode;
}

export const StyledContainer: React.FC<StyledContainerProps> = ({
  children,
}) => {
  const bodyBg = useColorModeValue("gray.50", "gray.900");

  return (
    <Box bg={bodyBg} minH="100vh">
      <Container bg={bodyBg} centerContent maxW="6xl" py={8}>
        {children}
      </Container>
    </Box>
  );
};
