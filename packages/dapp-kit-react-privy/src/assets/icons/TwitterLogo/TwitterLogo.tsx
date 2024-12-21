import { Box, BoxProps } from '@chakra-ui/react';
import React from 'react';
import { twitterSvg } from '../../svg';

type Props = {
    isDark?: boolean;
    boxSize?: string | number;
} & Omit<BoxProps, 'dangerouslySetInnerHTML'>;

export const TwitterLogo: React.FC<Props> = ({
    isDark,
    boxSize = '20px',
    ...props
}) => {
    return (
        <Box
            as="span"
            display="inline-block"
            width={boxSize}
            height={boxSize}
            dangerouslySetInnerHTML={{
                __html: isDark ? twitterSvg.dark : twitterSvg.light,
            }}
            {...props}
        />
    );
};
