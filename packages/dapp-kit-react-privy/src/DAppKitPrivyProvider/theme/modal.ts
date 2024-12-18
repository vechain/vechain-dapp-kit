import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import {
    StyleFunctionProps,
    createMultiStyleConfigHelpers,
} from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(parts.keys);

const modalContentProps = {
    base: {
        borderRadius: '24px 24px 0px 0px',
        position: 'fixed',
        bottom: '0px',
        mb: '0',
        maxW: '2xl',
    },
    '@media (min-width: 768px)': {
        borderRadius: '24px 24px 24px 24px',
        position: 'relative',
        bottom: 'auto',
        mb: 'auto',
    },
};

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
            modalContent: modalContentProps,
        }),
};

export const modalTheme = defineMultiStyleConfig({
    variants,
    defaultProps: {
        variant: 'base', // default is solid
    },
});
