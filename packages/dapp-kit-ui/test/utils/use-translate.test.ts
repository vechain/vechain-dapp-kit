import { defaultI18n, useTranslate } from '../../src';
import { describe, expect, it } from 'vitest';

describe('useTranslate', () => {
    it('should return correct translation', () => {
        const translate = useTranslate(defaultI18n, 'en');
        expect(translate('connect-wallet')).toBe('Connect Wallet');
    });
    it('should fallback to en if language not found', () => {
        const translate = useTranslate(defaultI18n, 'pl');
        expect(translate('connect-wallet')).toBe('Connect Wallet');
    });
    it('should fallback to passed string if translation not found', () => {
        const translate = useTranslate(defaultI18n, 'en');
        expect(translate('hello')).toBe('hello');
    });
});
