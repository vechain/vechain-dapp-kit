import type { HTMLChakraProps } from '@chakra-ui/react';
import { Image } from '@chakra-ui/react';
import React from 'react';
import { VeWorldLogo as VWLogo } from '@vechainfoundation/vanilla-wallet-kit';

type IIMage = HTMLChakraProps<'img'>;

export const VeWorldLogo: React.FC<IIMage> = ({ ...props }) => {
    return (
        <Image
            alt="VeWorld logo"
            h="full"
            objectFit="cover"
            src={VWLogo}
            {...props}
        />
    );
};
