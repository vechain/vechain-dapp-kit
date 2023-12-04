// ThemeSelector.js

import React from 'react';
// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components';
import { useThemeSelector } from '../provider/ThemeProvider';

const Button = styled.button``;

const ThemeSelector = () => {
    const { toggleTheme } = useThemeSelector();

    return <Button onClick={toggleTheme}>Toggle Theme</Button>;
};

export { ThemeSelector };
