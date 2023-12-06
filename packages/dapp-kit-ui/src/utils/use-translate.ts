import type { Language, TranslationKey, I18n } from '../constants';

export const useTranslate =
    (i18n: I18n, language: Language) =>
    (s: TranslationKey): string => {
        let _language = language;

        if (!i18n[_language]) {
            _language = 'en';
        }

        if (!i18n[_language][s]) {
            return s;
        }

        return i18n[_language][s];
    };
