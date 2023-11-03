// ThemeSelector.js

import React, { useContext } from 'react';
import { ThemeContext } from '../../provider/ThemeProvider';
import styled from 'styled-components';

const Button = styled.button``;

const ThemeSelector = () => {
    const { toggleTheme } = useContext(ThemeContext);

    return <Button onClick={toggleTheme}>Toggle Theme</Button>;
};

export { ThemeSelector };
