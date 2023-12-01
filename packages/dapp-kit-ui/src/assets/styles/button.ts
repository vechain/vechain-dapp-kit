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
        background-color: var(--vwk-color-xxlightgrey, ${Colors.XXLightGrey});
        color: var(--vwk-color-lightblack, ${Colors.LightBlack});
    }
    button.LIGHT:hover {
        background-color: var(--vwk-color-xlightgrey, ${Colors.XLightGrey});
    }
    button.LIGHT:active {
        background-color: var(--vwk-color-lightgrey, ${Colors.LightGrey});
    }

    button.DARK {
        background-color: var(--vwk-color-xxdarkgrey, ${Colors.XXDarkGrey});
        color: var(--vwk-color-xxlightgrey, ${Colors.XXLightGrey});
    }
    button.DARK:hover {
        background-color: var(--vwk-color-xdarkgrey, ${Colors.XDarkGrey});
    }
    button.DARK:active {
        background-color: var(--vwk-color-darkgrey, ${Colors.DarkGrey});
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
        background-color: var(--vwk-color-xxlightgrey, ${Colors.XXLightGrey});
        color: var(--vwk-color-lightblack, ${Colors.LightBlack});
    }
    button.LIGHT:hover {
        background-color: var(--vwk-color-xlightgrey, ${Colors.XLightGrey});
    }
    button.LIGHT:active {
        background-color: var(--vwk-color-lightgrey, ${Colors.LightGrey});
    }

    button.DARK {
        background-color: var(--vwk-color-lightblack, ${Colors.LightBlack});
        color: var(--vwk-color-xxlightgrey, ${Colors.XXLightGrey});
    }
    button.DARK:hover {
        background-color: var(--vwk-color-xlightblack, ${Colors.XLightBlack});
    }
    button.DARK:active {
        background-color: var(--vwk-color-xxlightblack, ${Colors.XXLightBlack});
    }
`;
