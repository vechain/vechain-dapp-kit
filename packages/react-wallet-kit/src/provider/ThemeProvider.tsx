// ThemeProvider.js

import React, { useState, createContext } from 'react';
import { lightTheme, darkTheme } from '../ConnectWalletButton/Constants';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

const ThemeContext = createContext({
    theme: lightTheme,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    toggleTheme: () => {},
});

const ThemeProvider = ({ children }: any) => {
    const [currentTheme, setCurrentTheme] = useState(lightTheme);

    const toggleTheme = () => {
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
