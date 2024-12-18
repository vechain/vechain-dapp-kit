import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import {
    StyleFunctionProps,
    createMultiStyleConfigHelpers,
} from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(parts.keys);

const variants = {
    base: (props: StyleFunctionProps) =>
        definePartsStyle({
            dialog: {
                borderRadius: '24px',
                backgroundColor:
                    props.colorMode === 'dark' ? '#1f1f1e' : 'white',
            },
            closeButton: {
                borderRadius: '50%',
            },
        }),
};

export const modalTheme = defineMultiStyleConfig({
    variants,
    defaultProps: {
        variant: 'base', // default is solid
    },
});
