import { picasso } from '@vechain/picasso';

export const humanAddress = (
    address: string,
    charAtStart = 6,
    charAtEnd = 4,
): string => `${address.slice(0, charAtStart)}••••${address.slice(-charAtEnd)}`;

export const humanDomain = (
    domain: string,
    lengthBefore = 8,
    lengthAfter = 6,
) => {
    // if domain is smaller than lengthBefore + lengthAfter, return the domain
    if (domain.length <= lengthBefore + lengthAfter) return domain;

    const before = domain.substring(0, lengthBefore);
    const after = domain.substring(domain.length - lengthAfter);
    return `${before}••••${after}`;
};

export const getPicassoImage = (address: string, base64 = false): string => {
    const image = picasso(address.toLowerCase());
    if (base64) {
        const base64data = Buffer.from(image, 'utf8').toString('base64');
        return `data:image/svg+xml;base64,${base64data}`;
    }
    return `data:image/svg+xml;utf8,${image}`;
};
