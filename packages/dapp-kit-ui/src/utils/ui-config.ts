import { type DAppKitUIOptions } from '../client';
import {
    Colors,
    Font,
    modalZIndex,
    defaultI18n,
    type I18n,
    modalBackdropFilter,
    modalWidth,
    sourceCardBorder,
} from '../constants';

const getModal = (): HTMLElement | null => document.querySelector('vdk-modal');

export const createModalIfNotPresent = (options?: {
    modalParent?: HTMLElement;
}): HTMLElement => {
    const modal = getModal();

    if (modal) {
        return modal;
    }

    const newModal = document.createElement('vdk-modal');

    (options?.modalParent ?? document.body).appendChild(newModal);

    return newModal;
};

const ThemeVariables = {
    '--vdk-color-dark-primary': Colors.Dark.Primary.toString(),
    '--vdk-color-dark-primary-hover': Colors.Dark.PrimaryHover.toString(),
    '--vdk-color-dark-primary-active': Colors.Dark.PrimaryActive.toString(),
    '--vdk-color-dark-secondary': Colors.Dark.Secondary.toString(),
    '--vdk-color-dark-tertiary': Colors.Dark.Tertiary.toString(),
    '--vdk-color-dark-quaternary': Colors.Dark.Quaternary.toString(),
    '--vdk-color-light-primary': Colors.Light.Primary.toString(),
    '--vdk-color-light-primary-hover': Colors.Light.PrimaryHover.toString(),
    '--vdk-color-light-primary-active': Colors.Light.PrimaryActive.toString(),
    '--vdk-color-light-secondary': Colors.Light.Secondary.toString(),
    '--vdk-color-light-tertiary': Colors.Light.Tertiary.toString(),
    '--vdk-color-light-quaternary': Colors.Light.Quaternary.toString(),
    '--vdk-color-walletconnectblue': Colors.WalletConnectBlue.toString(),
    '--vdk-font-family': Font.Family.toString(),
    '--vdk-font-size-medium': Font.Size.Medium.toString(),
    '--vdk-font-size-large': Font.Size.Large.toString(),
    '--vdk-font-weight-medium': Font.Weight.Medium.toString(),
    '--vdk-modal-z-index': modalZIndex.toString(),
    '--vdk-modal-backdrop-filter': modalBackdropFilter.toString(),
    '--vdk-modal-width': modalWidth.toString(),
    '--vdk-border-light-source-card': sourceCardBorder.Light.toString(),
    '--vdk-border-dark-source-card': sourceCardBorder.Dark.toString(),
};

export type ThemeVariables = keyof typeof ThemeVariables;

export type CustomizedStyle = {
    [key in ThemeVariables]?: string;
};

export const initStyles = (customizedStyle: CustomizedStyle): void => {
    const root: HTMLElement | null = document.querySelector(':root');

    if (root) {
        for (const [key, value] of Object.entries({
            ...ThemeVariables,
            ...customizedStyle,
        })) {
            root.style.setProperty(key, value);
        }
    }
};

const getInitOptions = (
    options: DAppKitUIOptions,
): {
    mode?: string;
    i18n?: I18n;
    language?: string;
} => {
    return {
        mode: options.themeMode ?? 'LIGHT',
        i18n: options.i18n ? { ...defaultI18n, ...options.i18n } : defaultI18n,
        language: options.language ?? 'en',
    };
};

export const initButton = (options: DAppKitUIOptions): void => {
    const buttons = document.querySelectorAll('vdk-button');
    const initOptions = getInitOptions(options);
    buttons.forEach((button) => {
        for (const [key, value] of Object.entries(initOptions)) {
            if (value) {
                (button as any)[key] = value;
            }
        }
    });
};

export const initModal = (options: DAppKitUIOptions): void => {
    const modal = document.querySelector('vdk-modal');
    const initOptions = getInitOptions(options);
    if (!modal) {
        return;
    }
    for (const [key, value] of Object.entries(initOptions)) {
        if (value) {
            (modal as any)[key] = value;
        }
    }
    if (options.onSourceClick) {
        modal.onSourceClick = options.onSourceClick;
    }
};

export const initModalAndButton = (options: DAppKitUIOptions): void => {
    // configure theme variables
    if (options.themeVariables) {
        initStyles(options.themeVariables);
    }

    initButton(options);
    initModal(options);
};
