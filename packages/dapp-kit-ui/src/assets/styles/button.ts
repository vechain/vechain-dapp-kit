import { css } from 'lit';
import { Colors } from '../../constants/colors';

export const buttonStyle = css`
    button {
        font-family: 'Inter', sans-serif;
        cursor: pointer;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border: none;
        border-radius: 12px;
        padding: 12px;
        font-size: 15px;
        font-weight: 500;
        width: 100%;
        gap: 10px;
    }

    button.LIGHT {
        background-color: ${Colors.XXLightGrey};
        color: ${Colors.LightBlack};
    }
    button.LIGHT:hover {
        background-color: ${Colors.XLightGrey};
    }
    button.LIGHT:active {
        background-color: ${Colors.LightGrey};
    }

    button.DARK {
        background-color: ${Colors.XXDarkGrey};
        color: ${Colors.XXLightGrey};
    }
    button.DARK:hover {
        background-color: ${Colors.XDarkGrey};
    }
    button.DARK:active {
        background-color: ${Colors.DarkGrey};
    }
`;

export const triggerButtonStyle = css`
    button {
        font-family: 'Inter', sans-serif;
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border: none;
        border-radius: 12px;
        padding: 12px;
    }

    button.LIGHT {
        background-color: ${Colors.XXLightGrey};
        color: ${Colors.LightBlack};
    }
    button.LIGHT:hover {
        background-color: ${Colors.XLightGrey};
    }
    button.LIGHT:active {
        background-color: ${Colors.LightGrey};
    }

    button.DARK {
        background-color: ${Colors.LightBlack};
        color: ${Colors.XXLightGrey};
    }
    button.DARK:hover {
        background-color: ${Colors.XLightBlack};
    }
    button.DARK:active {
        background-color: ${Colors.XXLightBlack};
    }
`;
