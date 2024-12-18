import { Circle, HStack, Image, Text, useColorMode } from '@chakra-ui/react';
import { AppInfo } from '../ConnectModal/MainContent';

type AppLogosProps = {
    apps: AppInfo[];
    maxDisplayed?: number;
    showText?: boolean;
    textContent?: string;
    size?: string;
    my?: number | string;
};

export const AppLogos = ({
    apps,
    maxDisplayed = 3,
    showText = true,
    textContent = 'Continue with VeChain Apps',
    size = '40px',
    my = 0,
}: AppLogosProps) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    return (
        <HStack
            w={'full'}
            justify={'center'}
            position="relative"
            h={size}
            my={my}
        >
            {showText && (
                <Text
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                    ml={apps.length > 3 ? '120px' : '70px'}
                >
                    {textContent}
                </Text>
            )}
            {apps.slice(0, maxDisplayed).map((app, index) => (
                <Circle
                    key={index}
                    size={size}
                    bg={isDark ? '#2D2D2D' : '#F5F5F5'}
                    border="1px solid"
                    borderColor={isDark ? '#3D3D3D' : '#FFFFFF'}
                    overflow="hidden"
                    zIndex={maxDisplayed - index}
                    position={showText ? 'absolute' : 'relative'}
                    left={showText ? `${index * 27}px` : 'auto'}
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
        </HStack>
    );
};
