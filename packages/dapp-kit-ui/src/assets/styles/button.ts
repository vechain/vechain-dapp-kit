import { css } from 'lit';
import { Colors, Font } from '../../constants';

export const buttonStyle = css`
    button {
        font-family: var(--vwk-font-family, ${Font.Family});
        font-size: var(--vwk-font-size-medium, ${Font.Size.Medium});
        font-weight: var(--vwk-font-weight-medium, ${Font.Weight.Medium});
        cursor: pointer;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border: none;
        border-radius: 12px;
        padding: 12px;
        width: 100%;
        gap: 10px;
    }

    button.LIGHT {
        background-color: var(
            --vwk-color-light-primary,
            ${Colors.Light.Primary}
        );
        color: var(--vwk-color-light-tertiary, ${Colors.Light.Tertiary});
    }
    button.LIGHT:hover {
        background-color: var(
            --vwk-color-light-primary-hover,
            ${Colors.Light.PrimaryHover}
        );
    }
    button.LIGHT:active {
        background-color: var(
            --vwk-color-light-primary-active,
            ${Colors.Light.PrimaryActive}
        );
    }

    button.DARK {
        background-color: var(--vwk-color-dark-primary, ${Colors.Dark.Primary});
        color: var(--vwk-color-dark-tertiary, ${Colors.Dark.Tertiary});
    }
    button.DARK:hover {
        background-color: var(
            --vwk-color-dark-primary-hover,
            ${Colors.Dark.PrimaryHover}
        );
    }
    button.DARK:active {
        background-color: var(
            --vwk-color-dark-primary-active,
            ${Colors.Dark.PrimaryActive}
        );
    }
`;
