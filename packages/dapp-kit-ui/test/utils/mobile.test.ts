import { isAndroid, isMobile } from '../../src/utils/mobile';
import { describe, expect, it } from 'vitest';

describe('isMobile', () => {
    it('should return true for a mobile user agent', () => {
        Object.defineProperty(window, 'navigator', {
            value: {
                userAgent:
                    'Mozilla/5.0 (Android; Mobile; rv:40.0) Gecko/40.0 Firefox/40.0',
            } as Navigator,
            writable: true,
        });
        expect(isMobile()).toBe(true);
    });

    it('should return false for a non-mobile user agent', () => {
        Object.defineProperty(window, 'navigator', {
            value: {
                userAgent:
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
            } as Navigator,
            writable: true,
        });
        expect(isMobile()).toBe(false);
    });
});

describe('isAndroid', () => {
    it('should return true for an Android user agent', () => {
        Object.defineProperty(window, 'navigator', {
            value: {
                userAgent:
                    'Mozilla/5.0 (Linux; Android 10; SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.181 Mobile Safari/537.36',
            } as Navigator,
            writable: true,
        });
        expect(isAndroid()).toBe(true);
    });

    it('should return false for a non-Android user agent', () => {
        Object.defineProperty(window, 'navigator', {
            value: {
                userAgent:
                    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
            } as Navigator,
            writable: true,
        });
        expect(isAndroid()).toBe(false);
    });
});
