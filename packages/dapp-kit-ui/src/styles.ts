import { Colors, Font, type ThemeMode, modalZIndex } from './constants';

const StyleVariables = {
    '--vwk-color-dark-primary': Colors.Dark.Primary.toString(),
    '--vwk-color-dark-primary-hover': Colors.Dark.PrimaryHover.toString(),
    '--vwk-color-dark-primary-active': Colors.Dark.PrimaryActive.toString(),
    '--vwk-color-dark-secondary': Colors.Dark.Secondary.toString(),
    '--vwk-color-dark-tertiary': Colors.Dark.Tertiary.toString(),
    '--vwk-color-dark-quaternary': Colors.Dark.Quaternary.toString(),
    '--vwk-color-light-primary': Colors.Light.Primary.toString(),
    '--vwk-color-light-primary-hover': Colors.Light.PrimaryHover.toString(),
    '--vwk-color-light-primary-active': Colors.Light.PrimaryActive.toString(),
    '--vwk-color-light-secondary': Colors.Light.Secondary.toString(),
    '--vwk-color-light-tertiary': Colors.Light.Tertiary.toString(),
    '--vwk-color-light-quaternary': Colors.Light.Quaternary.toString(),
    '--vwk-color-walletconnectblue': Colors.WalletConnectBlue.toString(),
    '--vwk-font-family': Font.Family.toString(),
    '--vwk-font-size-medium': Font.Size.Medium.toString(),
    '--vwk-font-size-large': Font.Size.Large.toString(),
    '--vwk-font-weight-medium': Font.Weight.Medium.toString(),
    '--vwk-modal-z-index': modalZIndex.toString(),
};

export type StyleVariables = keyof typeof StyleVariables;

export type CustomizedStyle = {
    [key in StyleVariables]?: string;
};

export const initStyles = (customizedStyle: CustomizedStyle): void => {
    const root: HTMLElement | null = document.querySelector(':root');

    if (root) {
        for (const [key, value] of Object.entries({
            ...StyleVariables,
            ...customizedStyle,
        })) {
            root.style.setProperty(key, value);
        }
    }
};

export const initMode = (mode: ThemeMode): void => {
    const button = document.querySelector('vwk-button');
    const modal = document.querySelector('vwk-modal');

    if (button) {
        button.mode = mode;
    }
    if (modal) {
        modal.mode = mode;
    }
};
