// ThemeProvider.js

import type { ReactNode } from 'react';
import React, { createContext, useState } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import type { ThemeMode } from '@vechainfoundation/dapp-kit-ui';

interface Theme {
    mode: ThemeMode;
}

interface ThemeContextProperties {
    theme: Theme;
    toggleTheme: () => void;
}

const defaultTheme: Theme = {
    mode: 'LIGHT',
};

const ThemeContext = createContext<ThemeContextProperties | undefined>(
    undefined,
);

const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [currentTheme, setCurrentTheme] = useState(defaultTheme);

    const toggleTheme = (): void => {
        setCurrentTheme((prevTheme) => {
            if (prevTheme.mode === 'LIGHT') {
                return { mode: 'DARK' };
            }

            return { mode: 'LIGHT' };
        });
    };

    return (
        <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
            <StyledThemeProvider theme={currentTheme}>
                {children}
            </StyledThemeProvider>
        </ThemeContext.Provider>
    );
};

export { ThemeProvider, ThemeContext, type ThemeContextProperties };
