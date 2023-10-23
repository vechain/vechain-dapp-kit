import type {
  HTMLChakraProps} from "@chakra-ui/react";
import {
  Card,
  CardBody,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

interface StyledCardProps extends HTMLChakraProps<"div"> {
  children: React.ReactNode;
}

export const StyledCard: React.FC<StyledCardProps> = ({
  children,
  ...props
}) => {
  const cardBg = useColorModeValue("white", "gray.700");
  return (
    <Card bg={cardBg} {...props}>
      <CardBody>{children}</CardBody>
    </Card>
  );
};
