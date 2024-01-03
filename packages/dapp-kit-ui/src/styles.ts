import { Colors, Font } from './constants';
import { modalZIndex } from './constants/z-index';

const StyleVariables = {
    '--vwk-color-dark-primary': Colors.Dark.Primary,
    '--vwk-color-dark-primary-hover': Colors.Dark.PrimaryHover,
    '--vwk-color-dark-primary-active': Colors.Dark.PrimaryActive,
    '--vwk-color-dark-secondary': Colors.Dark.Secondary,
    '--vwk-color-dark-tertiary': Colors.Dark.Tertiary,
    '--vwk-color-dark-quaternary': Colors.Dark.Quaternary,
    '--vwk-color-light-primary': Colors.Light.Primary,
    '--vwk-color-light-primary-hover': Colors.Light.PrimaryHover,
    '--vwk-color-light-primary-active': Colors.Light.PrimaryActive,
    '--vwk-color-light-secondary': Colors.Light.Secondary,
    '--vwk-color-light-tertiary': Colors.Light.Tertiary,
    '--vwk-color-light-quaternary': Colors.Light.Quaternary,
    '--vwk-color-walletconnectblue': Colors.WalletConnectBlue,
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
        for (const [key, value] of Object.entries(customizedStyle)) {
            root.style.setProperty(key, value);
        }
    }
};
