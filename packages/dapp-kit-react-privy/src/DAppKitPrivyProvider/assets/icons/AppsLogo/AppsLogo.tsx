import { BoxProps, Image } from '@chakra-ui/react';
import React from 'react';

type Props = {
    boxSize?: string | number;
} & Omit<BoxProps, 'dangerouslySetInnerHTML'>;

export const AppsLogo: React.FC<Props> = ({ boxSize = '20px', ...props }) => {
    return (
        <Image
            src={'https://i.ibb.co/R6SWrWM/Group-40.png'}
            alt="apps-logo"
            maxW={boxSize}
            maxH={boxSize}
            {...props}
        />
    );
};
