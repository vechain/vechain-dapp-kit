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
                scrollbarWidth: 'none',
                overflow: 'scroll',
                overflowX: 'hidden',
                maxHeight: '520px',
                borderRadius: '24px',
                backgroundColor:
                    props.colorMode === 'dark' ? '#1f1f1e' : 'white',
            },
            closeButton: {
                borderRadius: '50%',
            },
        }),
    transactionToast: (props: StyleFunctionProps) =>
        definePartsStyle({
            dialog: {
                borderRadius: '15px',
                position: 'fixed',
                bottom: '10px',
                left: '10px',
                mimHeight: '70px',
                minWidth: '300px',
                maxWidth: '400px',
                width: 'fit-content',
                pointerEvents: 'auto',
                boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)',
                py: '10px',
                backgroundColor:
                    props.colorMode === 'dark' ? '#1f1f1e' : 'white',
            },
            closeButton: {
                borderRadius: '50%',
                width: '25px',
                height: '25px',
                size: '10px',
            },
        }),
};

export const modalTheme = defineMultiStyleConfig({
    variants,
    defaultProps: {
        variant: 'base',
    },
});
