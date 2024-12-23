import { Image, ImageProps } from '@chakra-ui/react';
import React from 'react';

type Props = {
    isDark?: boolean;
} & Omit<ImageProps, 'dangerouslySetInnerHTML'>;

export const VechainLogoHorizontal: React.FC<Props> = ({
    isDark = false,
    ...props
}) => {
    return (
        <Image
            src={
                isDark
                    ? 'https://i.ibb.co/zGdf6FS/01-Logo-Orizzontale-Negativo-RGB.png'
                    : 'https://i.ibb.co/KNVyJTM/01-Logo-Orizzontale-Positivo-RGB.png'
            }
            alt="Vechain Logo Horizontal"
            {...props}
        />
    );
};
