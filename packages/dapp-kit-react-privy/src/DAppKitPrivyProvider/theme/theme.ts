import { ThemeConfig, extendTheme } from '@chakra-ui/react';
import { modalTheme } from './modal';
import { cardTheme } from './card';
import { buttonTheme } from './button';

const themeConfig: ThemeConfig = {
    // 2. Add your color mode config
    useSystemColorMode: false,

    // @ts-ignore
    components: {
        Modal: modalTheme,
        Card: cardTheme,
        Button: buttonTheme,
    },
};
export const Theme = extendTheme(themeConfig);
