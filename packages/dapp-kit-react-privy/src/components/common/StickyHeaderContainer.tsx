import { Box, useColorMode, useMediaQuery } from '@chakra-ui/react';

export const StickyHeaderContainer = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [isDesktop] = useMediaQuery('(min-width: 768px)');
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    return (
        <Box
            position={'fixed'}
            w={'fill-available'}
            maxW={isDesktop ? '380px' : 'full'}
            borderRadius={'24px'}
            bg={isDark ? '#1f1f1e' : 'white'}
            zIndex={1000}
        >
            {children}
        </Box>
    );
};
