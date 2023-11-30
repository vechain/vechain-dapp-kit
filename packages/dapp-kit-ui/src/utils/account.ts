import { picasso } from '@vechain/picasso';

export const getPicassoImage = (address: string, base64 = false): string => {
    const image = picasso(address.toLowerCase());
    if (base64) {
        const base64data = Buffer.from(image, 'utf8').toString('base64');
        return `data:image/svg+xml;base64,${base64data}`;
    }
    return `data:image/svg+xml;utf8,${image}`;
};

export const friendlyAddress = (
    address: string,
    lengthBefore = 6,
    lengthAfter = 4,
): string => {
    const before = address.substring(0, lengthBefore);
    const after = address.substring(address.length - lengthAfter);
    return `${before}••••${after}`;
};
