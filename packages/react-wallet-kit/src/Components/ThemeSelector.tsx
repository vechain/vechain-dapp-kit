// ThemeSelector.js

import React, { useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../provider/ThemeProvider';

const Button = styled.button``;

const ThemeSelector = () => {
    const { toggleTheme } = useContext(ThemeContext);

    return <Button onClick={toggleTheme}>Toggle Theme</Button>;
};

export { ThemeSelector };
