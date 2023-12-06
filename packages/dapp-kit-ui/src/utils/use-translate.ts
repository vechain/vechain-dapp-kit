import type { Language, TranslationKey, I18n } from '../constants';

export const useTranslate =
    (i18n: I18n, language: Language) =>
    (s: TranslationKey): string => {
        return i18n[language][s];
    };
