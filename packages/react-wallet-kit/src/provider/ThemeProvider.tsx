// ThemeProvider.js

import type { ReactNode } from 'react';
import React, { createContext, useState } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from '../Constants';

const ThemeContext = createContext({
    theme: lightTheme,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    toggleTheme: () => {},
});

const ThemeProvider = ({ children }: { children: ReactNode }): ReactNode => {
    const [currentTheme, setCurrentTheme] = useState(lightTheme);

    const toggleTheme = (): void => {
        setCurrentTheme((prevTheme) =>
            prevTheme === lightTheme ? darkTheme : lightTheme,
        );
    };

    return (
        <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
            <StyledThemeProvider theme={currentTheme}>
                {children}
            </StyledThemeProvider>
        </ThemeContext.Provider>
    );
};

export { ThemeProvider, ThemeContext };
