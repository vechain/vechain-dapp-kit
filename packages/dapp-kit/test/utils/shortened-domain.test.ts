import { describe, it, expect } from 'vitest';
import { shortenedDomain } from '../../src/utils/shortened-domain';

describe('shortenedDomain', () => {
    it('should return the original domain if length is 18 or less', () => {
        const shortDomain = 'short.vet';
        expect(shortenedDomain(shortDomain)).toBe(shortDomain);

        const exactlyEighteenChars = 'exactly18chars.vet';
        expect(shortenedDomain(exactlyEighteenChars)).toBe(
            exactlyEighteenChars,
        );
    });

    it('should shorten domains longer than 18 characters', () => {
        const longDomain = 'verylongdomainname.vet';
        const expected = 'verylongdo…ame.vet';
        expect(shortenedDomain(longDomain)).toBe(expected);
    });

    it('should handle very long domain names', () => {
        const veryLongDomain = 'extremelylongdomainnamethatgoeson.vet';
        const expected = 'extremelyl…son.vet';
        expect(shortenedDomain(veryLongDomain)).toBe(expected);
    });
});
