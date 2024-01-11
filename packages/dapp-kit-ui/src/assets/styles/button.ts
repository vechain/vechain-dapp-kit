import { css } from 'lit';
import { Colors, Font } from '../../constants';

export const buttonStyle = css`
    button {
        font-family: var(--vdk-font-family, ${Font.Family});
        font-size: var(--vdk-font-size-medium, ${Font.Size.Medium});
        font-weight: var(--vdk-font-weight-medium, ${Font.Weight.Medium});
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
        background: var(--vdk-color-light-primary, ${Colors.Light.Primary});
        color: var(--vdk-color-light-tertiary, ${Colors.Light.Tertiary});
    }
    button.LIGHT:hover:not(:disabled) {
        background: var(
            --vdk-color-light-primary-hover,
            ${Colors.Light.PrimaryHover}
        );
    }
    button.LIGHT:active:not(:disabled) {
        background: var(
            --vdk-color-light-primary-active,
            ${Colors.Light.PrimaryActive}
        );
    }
    button.LIGHT:disabled {
        opacity: 0.8;
    }

    button.DARK {
        background: var(--vdk-color-dark-primary, ${Colors.Dark.Primary});
        color: var(--vdk-color-dark-tertiary, ${Colors.Dark.Tertiary});
    }
    button.DARK:hover:not(:disabled) {
        background: var(
            --vdk-color-dark-primary-hover,
            ${Colors.Dark.PrimaryHover}
        );
    }
    button.DARK:active:not(:disabled) {
        background: var(
            --vdk-color-dark-primary-active,
            ${Colors.Dark.PrimaryActive}
        );
    }

    button.DARK:disabled {
        opacity: 0.8;
    }
`;

export const iconButtonStyle = css`
    .icon-button {
        cursor: pointer;
        width: 25px;
        height: 25px;
        padding: 5px;
        border-radius: 50%;
    }

    .icon-button.LIGHT:hover {
        background: var(
            --vdk-color-light-primary,
            ${Colors.Light.PrimaryHover}
        );
    }

    .icon-button.DARK:hover {
        background: var(--vdk-color-dark-primary, ${Colors.Dark.PrimaryHover});
    }

    .icon-button.LIGHT:active {
        background: var(
            --vdk-color-light-primary,
            ${Colors.Light.PrimaryActive}
        );
    }

    .icon-button.DARK:active {
        background: var(--vdk-color-dark-primary, ${Colors.Dark.PrimaryActive});
    }

    button:disabled {
        opacity: 0.8;
    }
`;
