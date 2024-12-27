import { Icon, IconProps } from '@chakra-ui/react';
import React from 'react';

type Props = {
    isDark?: boolean;
} & Omit<IconProps, 'dangerouslySetInnerHTML'>;

export const VechainLogo: React.FC<Props> = ({ isDark = false, ...props }) => {
    return (
        <Icon viewBox="0 0 320 292" {...props}>
            <path
                d="M320 0H291.94c-7 0-13.34 4-15.94 10.3L198.83 167.26l-0.08-0.17-20 41.65 0.08 0.17-20 41.65-100-208.17h28.52c7 0 13.34 4 15.94 10.3l65.2 135.15 20-41.65L137.91 37C127.23 14.72 104.74 0 80.07 0H0l20 41.65h0.06L140.41 292h40L320 0Z"
                fill={isDark ? 'white' : 'black'}
            />
        </Icon>
    );
};
