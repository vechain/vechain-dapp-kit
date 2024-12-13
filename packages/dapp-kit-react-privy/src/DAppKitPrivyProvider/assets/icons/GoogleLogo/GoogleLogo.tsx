import { Box, BoxProps } from '@chakra-ui/react';
import React from 'react';
import { googleSvg } from '../../svg';

type Props = {
    boxSize?: string | number;
} & Omit<BoxProps, 'dangerouslySetInnerHTML'>;

export const GoogleLogo: React.FC<Props> = ({ boxSize = '20px', ...props }) => {
    return (
        <Box
            as="span"
            display="inline-block"
            width={boxSize}
            height={boxSize}
            dangerouslySetInnerHTML={{
                __html: googleSvg,
            }}
            {...props}
        />
    );
};
