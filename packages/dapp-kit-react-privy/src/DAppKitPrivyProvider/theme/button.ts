import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const baseStyle = defineStyle({
    borderRadius: '12px',
});

const variants = {
    loginIn: defineStyle(() => ({
        bg: '#f2f2f2',
        color: '#2a2a2a',
        _hover: {
            bg: '#eaeaea',
        },
        _dark: {
            bg: '#1f1f1e',
            color: '#ffffff',
            _hover: {
                bg: '#3c3c39',
            },
            border: '1px solid #5e5e5e',
        },
    })),
};

export const buttonTheme = defineStyleConfig({
    baseStyle,
    variants,
});
