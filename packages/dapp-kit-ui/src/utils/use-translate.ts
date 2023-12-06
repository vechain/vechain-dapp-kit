import { type I18n } from '../constants';

export const useTranslate =
    (i18n: I18n, language: string) =>
    (s: string): string => {
        return i18n?.[language]?.[s] || i18n?.['en']?.[s] || s;
    };
