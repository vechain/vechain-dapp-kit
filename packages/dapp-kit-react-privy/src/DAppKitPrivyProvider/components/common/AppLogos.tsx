import { Circle, HStack, Image, Text, useColorMode } from '@chakra-ui/react';
import { PrivyAppInfo, SocialInfo } from '../../utils';

export type AppLogosProps = {
    apps: PrivyAppInfo[] | SocialInfo[];
    maxDisplayed?: number;
    showText?: boolean;
    textContent?: string;
    size?: string;
    my?: number | string;
    backgroundColor?: string;
};

export const AppLogos = ({
    apps,
    maxDisplayed = 2,
    showText = true,
    textContent = 'Continue with VeChain Apps',
    size = '40px',
    backgroundColor,
}: AppLogosProps) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    return (
        <HStack spacing={4} w={'full'} justify={'start'}>
            {apps.slice(0, maxDisplayed).map((app, index) => (
                <Circle
                    key={index}
                    size={size}
                    bg={backgroundColor ?? (isDark ? '#d3d3d3' : '#F5F5F5')}
                    // border="1px solid"
                    // borderColor={isDark ? '#d3d3d3' : '#FFFFFF'}
                    overflow="hidden"
                    position={'absolute'}
                    zIndex={100 - index}
                    boxShadow={'0px 0px 10px 0px rgba(0, 0, 0, 0.1)'}
                    left={`${index === 0 ? 90 : 90 - index * 25}px`}
                >
                    <Image
                        src={app.logo_url}
                        alt={app.name}
                        w={`calc(${size} * 0.6)`}
                        h={`calc(${size} * 0.6)`}
                        objectFit="contain"
                    />
                </Circle>
            ))}

            {showText && (
                <HStack ml={'80px'} w={'full'} justify={'start'}>
                    <Text color={isDark ? '#dfdfdd' : '#4d4d4d'}>
                        {textContent}
                    </Text>
                </HStack>
            )}
        </HStack>
    );
};
