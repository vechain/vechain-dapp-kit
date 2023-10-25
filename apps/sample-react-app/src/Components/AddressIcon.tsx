import React from 'react';
import type { HTMLChakraProps } from '@chakra-ui/react';
import { Img } from '@chakra-ui/react';
import { getPicassoImgSrc } from '../Utils/AccountUtils';

interface AddressIconProps extends HTMLChakraProps<'img'> {
    address: string;
}

export const AddressIcon: React.FC<AddressIconProps> = ({
    address,
    ...props
}) => {
    return <Picasso address={address} {...props} />;
};

interface PicassoProps extends HTMLChakraProps<'img'> {
    address: string;
}

const Picasso: React.FC<PicassoProps> = ({ address, ...props }) => {
    return (
        <Img
            h="100%"
            objectFit="cover"
            src={getPicassoImgSrc(address)}
            {...props}
        />
    );
};
